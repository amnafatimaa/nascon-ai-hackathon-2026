"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { EditionActions } from "./EditionActions";
import { LeadStory } from "./LeadStory";
import { ArticleCard } from "./ArticleCard";
import { NewsSection } from "./NewsSection";
import { NewspaperHeader } from "./NewspaperHeader";
import {
  articlesForSection,
  DEMO_NOTICE,
  getSection,
  personalizeIntro,
  todaysEdition,
} from "@/lib/mock-data";
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

  const welcome = personalizeIntro(prefs.interests, prefs.customInterests);
  const hasProfile =
    prefs.interests.length > 0 || prefs.customInterests.length > 0;

  const renderedSections = useMemo(() => {
    return todaysEdition.sectionIds
      .map((id) => getSection(id))
      .filter((section): section is NonNullable<typeof section> =>
        Boolean(section),
      )
      .map((section) => ({
        section,
        articles: articlesForSection(section),
      }));
  }, []);

  const front = renderedSections.find((item) => item.section.id === "front-page");
  const rest = renderedSections.filter((item) => item.section.id !== "front-page");
  const lead = front?.articles.find((article) => article.isLead) ?? front?.articles[0];
  const secondary = front?.articles.filter((article) => article.id !== lead?.id) ?? [];

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
    <main className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
      <p className="mb-6 text-center text-[11px] uppercase tracking-[0.18em] text-muted">
        {DEMO_NOTICE}
      </p>

      <NewspaperHeader edition={todaysEdition} welcome={welcome} />

      <div className="mt-6">
        <EditionActions />
      </div>

      {!prefs.completed ? (
        <p className="mt-6 border border-rule bg-cream px-4 py-3 text-[14px] leading-6 text-ink-soft">
          You are reading the sample edition without a completed profile.{" "}
          <Link href="/onboarding" className="text-burgundy underline decoration-rule underline-offset-4">
            Create my newspaper
          </Link>{" "}
          to record interests on this device. Access is not blocked.
        </p>
      ) : null}

      {front && lead ? (
        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <LeadStory
              article={lead}
              feedback={feedback[lead.id]}
              onFeedback={(kind) => handleFeedback(lead.id, kind)}
              showRelevance={hasProfile}
            />
          </div>
          <aside className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-8">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
              Also on the fold
            </p>
            <div className="mt-2 divide-y divide-rule">
              {secondary.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="compact"
                  feedback={feedback[article.id]}
                  onFeedback={(kind) => handleFeedback(article.id, kind)}
                  showRelevance={hasProfile}
                />
              ))}
            </div>
          </aside>
        </div>
      ) : null}

      {rest.map(({ section, articles }) => (
        <NewsSection
          key={section.id}
          section={section}
          articles={articles}
          feedback={feedback}
          onFeedback={handleFeedback}
          showRelevance={hasProfile}
        />
      ))}
    </main>
  );
}
