"use client";

import { useMemo, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { EditionActions } from "./EditionActions";
import { LeadStory } from "./LeadStory";
import { ArticleCard } from "./ArticleCard";
import { NewspaperHeader } from "./NewspaperHeader";
import { supabase } from "@/lib/supabase";
import { rankArticles, PreferenceWeights } from "@/lib/ranking";
import {
  getFeedbackServerSnapshot,
  getFeedbackSnapshot,
  getOnboardingServerSnapshot,
  getOnboardingSnapshot,
  saveArticleFeedback,
  subscribeFeedback,
  subscribeOnboarding,
} from "@/lib/storage";
import type { ArticleFeedbackKind } from "@/lib/types";

const DEFAULT_WEIGHTS: PreferenceWeights = {
  "artificial-intelligence": 3,
  technology: 3,
  programming: 3,
  robotics: 3,
};

// Tags too vague to learn from or to claim a "match" on.
const IGNORED_TAGS = new Set(["general", "news"]);

function feedbackDelta(kind?: string): number {
  if (kind === "more" || kind === "more_like_this" || kind === "like") return 5;
  if (
    kind === "less" ||
    kind === "not_interested" ||
    kind === "dislike" ||
    kind === "skip"
  )
    return -10;
  return 0;
}

function normalizeTag(tag: string): string {
  return String(tag)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function sanitizeUrl(rawUrl?: string, source?: string): string {
  if (!rawUrl) return "https://news.google.com";
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) return rawUrl;
  if (source?.toLowerCase().includes("bbc") && rawUrl.startsWith("/")) {
    return `https://www.bbc.com${rawUrl}`;
  }
  return `https://${rawUrl}`;
}

export function NewspaperExperience() {
  const prefs = useSyncExternalStore(
    subscribeOnboarding,
    getOnboardingSnapshot,
    getOnboardingServerSnapshot,
  );
  const feedback = useSyncExternalStore(
    subscribeFeedback,
    getFeedbackSnapshot,
    getFeedbackServerSnapshot,
  );

  const [dbArticles, setDbArticles] = useState<any[]>([]);
  const [baseWeights, setBaseWeights] = useState<PreferenceWeights>(DEFAULT_WEIGHTS);

  useEffect(() => {
    async function loadDataAndPreferences() {
      const initialWeights: PreferenceWeights = { ...DEFAULT_WEIGHTS };

      // 1. Give priority to local device onboarding preferences (prefs)
      const localInterests = [...(prefs.interests || []), ...(prefs.customInterests || [])];
      
      if (localInterests.length > 0) {
        localInterests.forEach((interest: string) => {
          const norm = normalizeTag(interest);
          initialWeights[norm] = 5;
          // Parent topic boosts for general tech tags
          if (["artificial-intelligence", "programming", "robotics", "software"].includes(norm)) {
            initialWeights["technology"] = (initialWeights["technology"] || 0) + 2;
          }
        });
        setBaseWeights(initialWeights);
      } else {
        // Fallback to Supabase latest row if local profile isn't saved yet
        const { data: prefData } = await supabase
          .from("user_preferences")
          .select("topics")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (prefData?.topics?.interests) {
          prefData.topics.interests.forEach((interest: string) => {
            const norm = normalizeTag(interest);
            initialWeights[norm] = 5;
          });
          setBaseWeights(initialWeights);
        }
      }

      // 2. Fetch live articles from Supabase
      const { data: articleData, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (articleData && !error) {
        const seen = new Set<string>();
        const uniqueArticles = articleData.filter((a: any) => {
          const key = String(a.url || a.title || a.id).trim().toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        const mapped = uniqueArticles.map((a: any) => {
          const timestamp = a.created_at || new Date().toISOString();
          const cleanUrl = sanitizeUrl(a.url, a.source);
          const imageUrl = a.image_url || a.imageUrl || null;
          const articleTags = Array.isArray(a.tags)
            ? a.tags.map((t: string) => normalizeTag(t))
            : ["news"];

          return {
            id: String(a.id),
            title: a.title,
            source: a.source || "News Feed",
            summary: a.summary || "No summary available.",
            tags: articleTags,
            url: cleanUrl,
            sourceUrl: cleanUrl,
            imageUrl,
            category: articleTags[0]
              ? String(articleTags[0]).replace(/-/g, " ").toUpperCase()
              : "NEWS",
            publishedAt: timestamp,
            created_at: timestamp,
            relevanceExplanation: `Matched with tags: ${articleTags.join(", ")}`,
          };
        });

        setDbArticles(mapped);
      }
    }

    loadDataAndPreferences();
  }, [prefs]);

  const welcome =
    prefs.interests.length > 0 || prefs.customInterests.length > 0
      ? `Folded this morning around ${[...prefs.interests, ...prefs.customInterests].slice(0, 3).join(", ")}.`
      : "Folded this morning around curated top headlines.";

  const hasProfile = prefs.interests.length > 0 || prefs.customInterests.length > 0;

  // Derive weights from base preferences + active user feedback clicks
  const weights = useMemo(() => {
    const next: PreferenceWeights = { ...baseWeights };
    for (const article of dbArticles) {
      const delta = feedbackDelta(feedback[String(article.id)]);
      if (!delta) continue;
      for (const tag of article.tags ?? []) {
        const norm = normalizeTag(tag);
        if (IGNORED_TAGS.has(norm)) continue;
        next[norm] = (next[norm] ?? 1) + delta;
      }
    }
    return next;
  }, [baseWeights, dbArticles, feedback]);

  const rankedArticles = useMemo(() => {
    if (dbArticles.length === 0) return [];
    const pretty = (t: string) => t.replace(/-/g, " ");
    return rankArticles(dbArticles, weights).map((article) => {
      const tags = (article.tags ?? [])
        .map((t) => normalizeTag(t))
        .filter((t) => !IGNORED_TAGS.has(t));

      const interests = tags.filter((t) => (baseWeights[t] ?? 0) > 0).map(pretty);
      const learned = tags.filter((t) => (weights[t] ?? 0) > 0).map(pretty);

      let relevanceExplanation = `Latest from ${article.source}`;
      if (interests.length) {
        relevanceExplanation = `Matches your interest in ${interests.join(", ")}`;
      } else if (learned.length) {
        relevanceExplanation = `Based on your "more like this" picks: ${learned.join(", ")}`;
      }
      return { ...article, relevanceExplanation };
    });
  }, [dbArticles, weights, baseWeights]);

  const leadArticle = rankedArticles[0];
  const secondaryArticles = rankedArticles.slice(1, 4);
  const lowerArticles = rankedArticles.slice(4);

  function handleFeedback(articleId: string, kind: ArticleFeedbackKind) {
    const next = { ...feedback };
    if (next[articleId] === kind) {
      delete next[articleId];
    } else {
      next[articleId] = kind;
    }
    saveArticleFeedback(next);
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12 selection:bg-burgundy selection:text-cream">
      <p className="mb-6 text-center text-[11px] font-mono uppercase tracking-[0.2em] text-muted">
        LIVE EDITION • POWERED BY AI & DYNAMIC PERSONALIZATION
      </p>

      <NewspaperHeader
        edition={{
          volume: 1,
          number: 1,
          date: "Saturday, October 17, 2026",
        } as any}
        welcome={welcome}
      />

      <div className="mt-6">
        <EditionActions />
      </div>

      {!prefs.completed ? (
        <p className="mt-6 border border-rule bg-paper-deep/60 px-4 py-3 text-[14px] leading-6 text-ink-soft font-serif">
          {welcome}{" "}
          <Link
            href="/onboarding"
            className="text-burgundy underline decoration-rule underline-offset-4 font-semibold"
          >
            Create my newspaper
          </Link>{" "}
          to record interests on this device.
        </p>
      ) : null}

      {leadArticle ? (
        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <LeadStory
              article={leadArticle as any}
              feedback={feedback[String(leadArticle.id)]}
              onFeedback={(kind) => handleFeedback(String(leadArticle.id), kind)}
              showRelevance={hasProfile}
            />
          </div>
          <aside className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-8">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted font-bold">
              Also on the fold
            </p>
            <div className="mt-2 divide-y divide-rule">
              {secondaryArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article as any}
                  variant="compact"
                  feedback={feedback[String(article.id)]}
                  onFeedback={(kind) => handleFeedback(String(article.id), kind)}
                  showRelevance={hasProfile}
                />
              ))}
            </div>
          </aside>
        </div>
      ) : null}

      {lowerArticles.length > 0 ? (
        <section className="mt-14 border-t-2 border-ink pt-8">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-ink mb-6">
            In Depth & Related Coverage
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {lowerArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article as any}
                variant="standard"
                feedback={feedback[String(article.id)]}
                onFeedback={(kind) => handleFeedback(String(article.id), kind)}
                showRelevance={hasProfile}
              />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}