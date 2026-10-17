import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/lib/supabase";

// Give the route room to finish on serverless hosts (Vercel etc.)
export const maxDuration = 60;

// Without customFields, rss-parser silently drops media:content / media:thumbnail,
// which is where BBC, The Verge, Wired etc. put their images.
const parser = new Parser({
  timeout: 5000,
  customFields: {
    item: [
      ["media:content", "media:content"],
      ["media:thumbnail", "media:thumbnail"],
    ],
  },
});
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const FEEDS = [
  // defaultTag is used when Gemini fails or returns nothing usable, so an article
  // still carries a tag that can match real preferences.
  { name: "BBC World", url: "http://feeds.bbci.co.uk/news/world/rss.xml", defaultTag: "world-affairs" },
  { name: "TechCrunch", url: "https://techcrunch.com/feed/", defaultTag: "technology" },
  { name: "The Verge", url: "https://www.theverge.com/rss/index.xml", defaultTag: "technology" },
  { name: "BBC Science", url: "http://feeds.bbci.co.uk/news/science_and_environment/rss.xml", defaultTag: "science" },
  { name: "Wired", url: "https://www.wired.com/feed/rss", defaultTag: "technology" },
];

// Fixed tag vocabulary. This is what makes ranking work: the tags written here
// must be the same strings used as keys in your preference weights
// (DEFAULT_WEIGHTS and the onboarding interests). Edit this list to match.
const TAXONOMY = [
  "artificial-intelligence",
  "technology",
  "programming",
  "robotics",
  "gadgets",
  "cybersecurity",
  "science",
  "space",
  "environment",
  "health",
  "business",
  "politics",
  "world-affairs",
  "education",
  "crime",
  "sports",
  "entertainment",
  "general",
];

// Common variants Gemini might return, mapped onto the taxonomy.
const ALIASES: Record<string, string> = {
  ai: "artificial-intelligence",
  ml: "artificial-intelligence",
  "machine-learning": "artificial-intelligence",
  tech: "technology",
  coding: "programming",
  software: "programming",
  gadget: "gadgets",
  security: "cybersecurity",
  climate: "environment",
  world: "world-affairs",
  geopolitics: "world-affairs",
  sanctions: "world-affairs",
};

type RawArticle = {
  title: string;
  source: string;
  url: string;
  content: string;
  image_url: string | null;
  defaultTag: string;
};

function decodeHtmlEntities(text: string): string {
  if (!text) return "";
  return text
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function extractFirstImgSrc(html: string): string | null {
  if (!html) return null;
  const match = html.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}

// When the RSS item has no image, read the article page's own preview image
// (og:image / twitter:image), which is the picture the publisher chose for that story.
async function fetchOgImage(pageUrl: string): Promise<string | null> {
  try {
    const res = await fetch(pageUrl, {
      signal: AbortSignal.timeout(4000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; MorningEditionBot/1.0)" },
    });
    if (!res.ok) return null;
    const html = (await res.text()).slice(0, 200_000);
    const tag = html.match(
      /<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]*>/i
    )?.[0];
    const content = tag?.match(/content=["']([^"']+)["']/i)?.[1];
    if (!content) return null;
    return new URL(decodeHtmlEntities(content), pageUrl).toString();
  } catch {
    return null;
  }
}

function normalizeTags(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out = new Set<string>();
  for (const t of raw) {
    if (typeof t !== "string") continue;
    const slug = t.toLowerCase().trim().replace(/\s+/g, "-");
    const mapped = ALIASES[slug] ?? slug;
    if (TAXONOMY.includes(mapped)) out.add(mapped);
  }
  return Array.from(out).slice(0, 4);
}

async function fetchFeed(feed: (typeof FEEDS)[number]): Promise<RawArticle[]> {
  const feedData = await parser.parseURL(feed.url);
  const articles: RawArticle[] = [];

  for (const item of feedData.items.slice(0, 3)) {
    if (!item.link) continue; // url is our dedupe key

    const titleClean = decodeHtmlEntities(item.title || "Untitled");
    const rawContent = stripHtml(
      decodeHtmlEntities(item.contentSnippet || item.content || item.title || "")
    ).slice(0, 1500);

    const imageUrl =
      item.enclosure?.url ||
      (item as any)["media:content"]?.$?.url ||
      (item as any)["media:thumbnail"]?.$?.url ||
      extractFirstImgSrc(item.content || (item as any)["content:encoded"] || "");

    articles.push({
      title: titleClean,
      source: feed.name,
      url: item.link,
      content: rawContent,
      image_url: imageUrl || null,
      defaultTag: feed.defaultTag,
    });
  }
  return articles;
}

async function enrich(article: RawArticle): Promise<{ summary: string; tags: string[] }> {
  const fallback = {
    summary:
      article.content.length > 160
        ? article.content.slice(0, 160) + "..."
        : article.content || article.title,
    tags: [article.defaultTag],
  };

  const prompt = `
You are an editorial assistant for a modern morning newspaper.
Summarize the article in exactly 2 concise sentences.
Choose 1-4 tags for the article, using ONLY tags from this list:
${TAXONOMY.join(", ")}
Use "general" only if nothing else fits.

Article Title: ${article.title}
Article Content: ${article.content}

Respond ONLY in valid JSON format:
{
  "summary": "2 sentence summary",
  "tags": ["tag1", "tag2"]
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const text = (response.text || "").replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(text);
    const tags = normalizeTags(parsed.tags);

    if (typeof parsed.summary === "string" && parsed.summary.trim()) {
      return { summary: parsed.summary.trim(), tags: tags.length ? tags : [article.defaultTag] };
    }
  } catch (aiErr) {
    console.warn("AI generation error, falling back:", aiErr);
  }
  return fallback;
}

export async function POST(request: Request) {
  // Optional guard: set INGEST_SECRET in your env and send it as the
  // x-ingest-secret header. If the env var isn't set, this is skipped.
  const secret = process.env.INGEST_SECRET;
  if (secret && request.headers.get("x-ingest-secret") !== secret) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all feeds in parallel; one failing feed doesn't sink the rest.
    const results = await Promise.allSettled(FEEDS.map(fetchFeed));
    const rawArticles: RawArticle[] = [];
    results.forEach((r, i) => {
      if (r.status === "fulfilled") rawArticles.push(...r.value);
      else console.warn(`Skipping feed ${FEEDS[i].name}:`, r.reason);
    });

    // De-duplicate by URL within this batch.
    const unique = Array.from(new Map(rawArticles.map((a) => [a.url, a])).values());

    // Enrich in small parallel chunks (faster than sequential, gentler on rate limits).
    const processedArticles: Array<{
      title: string;
      source: string;
      summary: string;
      tags: string[];
      url: string;
      image_url: string | null;
    }> = [];
    const CHUNK = 5;
    for (let i = 0; i < unique.length; i += CHUNK) {
      const chunk = unique.slice(i, i + CHUNK);
      const enriched = await Promise.all(
        chunk.map(async (article) => ({
          ...(await enrich(article)),
          image_url: article.image_url ?? (await fetchOgImage(article.url)),
        }))
      );
      chunk.forEach((article, j) => {
        processedArticles.push({
          title: article.title,
          source: article.source,
          summary: enriched[j].summary,
          tags: enriched[j].tags,
          url: article.url,
          image_url: enriched[j].image_url,
        });
      });
    }

    // Requires a unique constraint on articles.url (see SQL below).
    // Re-running ingestion skips articles that already exist.
    const { data, error } = await supabase
      .from("articles")
      .upsert(processedArticles, { onConflict: "url", ignoreDuplicates: true })
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      insertedCount: data?.length ?? 0,
      articles: data ?? [],
    });
  } catch (error: any) {
    console.error("Ingestion error:", error);
    return NextResponse.json(
      { success: false, error: error.message || String(error) },
      { status: 500 }
    );
  }
}