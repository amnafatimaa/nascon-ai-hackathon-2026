import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { GoogleGenAI } from "@google/genai";
import { supabase, supabaseAdmin } from "@/lib/supabase";

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

// Model name lives in one place. Override with GEMINI_MODEL in .env.local if it changes again.
const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

const FEEDS = [
  { name: "BBC World", url: "http://feeds.bbci.co.uk/news/world/rss.xml", defaultTag: "world-affairs" },
  { name: "TechCrunch", url: "https://techcrunch.com/feed/", defaultTag: "technology" },
  { name: "The Verge", url: "https://www.theverge.com/rss/index.xml", defaultTag: "technology" },
  { name: "BBC Science", url: "http://feeds.bbci.co.uk/news/science_and_environment/rss.xml", defaultTag: "science" },
  { name: "Wired", url: "https://www.wired.com/feed/rss", defaultTag: "technology" },
  { name: "Dawn", url: "https://www.dawn.com/feeds/home", defaultTag: "pakistan" },
  { name: "Dawn Business", url: "https://www.dawn.com/feeds/business", defaultTag: "finance" },
  { name: "BBC Business", url: "http://feeds.bbci.co.uk/news/business/rss.xml", defaultTag: "finance" },
  { name: "BBC Politics", url: "http://feeds.bbci.co.uk/news/politics/rss.xml", defaultTag: "politics" },
];

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
  "finance",
  "pakistan",
  "climate",
  "culture",
  "gaming",
];

const ALIASES: Record<string, string> = {
  ai: "artificial-intelligence",
  ml: "artificial-intelligence",
  "machine-learning": "artificial-intelligence",
  tech: "technology",
  coding: "programming",
  software: "programming",
  gadget: "gadgets",
  security: "cybersecurity",
  world: "world-affairs",
  geopolitics: "world-affairs",
  sanctions: "world-affairs",
  economy: "finance",
  markets: "finance",
  stocks: "finance",
  "pakistan-news": "pakistan",
  "climate-change": "climate",
  games: "gaming",
  "video-games": "gaming",
  arts: "culture",
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
    // Ampersands
    .replace(/&#038;/g, "&")
    .replace(/&#38;/g, "&")
    .replace(/&amp;/g, "&")

    // Single quotes & Apostrophes
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")

    // Double quotes
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')

    // Dashes & Hyphens
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")

    // Brackets & Miscellaneous symbols
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#160;/g, " ")
    .replace(/&hellip;/g, "…")
    .replace(/&#8230;/g, "…")
    .replace(/&copy;/g, "©")
    .replace(/&reg;/g, "®")
    .replace(/&trade;/g, "™");
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function extractFirstImgSrc(html: string): string | null {
  if (!html) return null;
  const match = html.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}

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
    if (!item.link) continue;

    const titleClean = decodeHtmlEntities(item.title || "Untitled");
    const rawContent = decodeHtmlEntities(
      stripHtml(item.contentSnippet || item.content || item.title || "")
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

const KEYWORD_TAGS: Record<string, RegExp> = {
  finance: /\b(stocks?|markets?|inflation|econom\w*|bank|imf|budget|rupee|invest\w*|gdp|trade|tax\w*|psx)\b/i,
  politics: /\b(election|parliament|minister|government|senate|president|opposition|vote|coalition)\b/i,
  pakistan: /\b(pakistan\w*|islamabad|karachi|lahore|punjab|sindh|balochistan|khyber)\b/i,
  climate: /\b(climate|global warming|emissions|carbon|net zero)\b/i,
  gaming: /\b(video games?|gaming|gamers?|playstation|xbox|nintendo|esports?)\b/i,
  culture: /\b(museum|exhibition|literature|novel|theatre|theater|festival|art gallery)\b/i,
};

function keywordTags(article: RawArticle): string[] {
  const text = `${article.title} ${article.content}`;
  return Object.entries(KEYWORD_TAGS)
    .filter(([, re]) => re.test(text))
    .map(([tag]) => tag);
}

async function enrich(article: RawArticle): Promise<{
  summary_brief: string;
  summary_detailed: string;
  tags: string[];
  geographic_scope: "local" | "regional" | "global";
}> {
  const kw = keywordTags(article);
  const mustHave = article.defaultTag === "pakistan" ? ["pakistan"] : [];
  const mergeTags = (aiTags: string[]) =>
    Array.from(new Set([...mustHave, ...aiTags, ...kw])).slice(0, 4);

  const fallbackTags = mergeTags([]);

  const fallback = {
    summary_brief: decodeHtmlEntities(
      article.content.length > 120
        ? article.content.slice(0, 120) + "..."
        : article.content || article.title
    ),
    summary_detailed: decodeHtmlEntities(
      article.content.length > 250
        ? article.content.slice(0, 250) + "..."
        : article.content || article.title
    ),
    tags: fallbackTags.length ? fallbackTags : [article.defaultTag],
    geographic_scope: (fallbackTags.includes("pakistan") ? "regional" : "global") as
      | "local"
      | "regional"
      | "global",
  };

  const prompt = `
You are an editorial assistant for a modern morning newspaper. Analyze the news article and produce a structured JSON object.

Article Title: "${article.title}"
Article Content: "${article.content}"

Choose 2 to 4 specific tags ONLY from this allowed taxonomy:
${TAXONOMY.join(", ")}

Requirements:
1. "summary_brief": A concise 2-sentence briefing (under 35 words) giving key facts for a quick scan.
2. "summary_detailed": A full executive recap (3 to 5 sentences, around 80-110 words) giving key facts, background context, and implications.
3. "tags": An array of 2 to 4 lowercase tags from the allowed taxonomy list above. Use "general" only if no other tag fits.
4. "geographic_scope": Must be one of ["local", "regional", "global"].

Respond ONLY in valid JSON format:
{
  "summary_brief": "...",
  "summary_detailed": "...",
  "tags": ["tag1", "tag2"],
  "geographic_scope": "global"
}
`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const text = (response.text || "").replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(text);
    const tags = mergeTags(normalizeTags(parsed.tags));

    return {
      summary_brief:
        typeof parsed.summary_brief === "string" && parsed.summary_brief.trim()
          ? decodeHtmlEntities(parsed.summary_brief.trim())
          : fallback.summary_brief,
      summary_detailed:
        typeof parsed.summary_detailed === "string" && parsed.summary_detailed.trim()
          ? decodeHtmlEntities(parsed.summary_detailed.trim())
          : fallback.summary_detailed,
      tags: tags.length ? tags : [article.defaultTag],
      geographic_scope: ["local", "regional", "global"].includes(parsed.geographic_scope)
        ? parsed.geographic_scope
        : fallback.geographic_scope,
    };
  } catch (aiErr) {
    console.warn("AI generation error, falling back:", aiErr);
  }
  return fallback;
}

export async function POST() {
  try {
    const results = await Promise.allSettled(FEEDS.map(fetchFeed));
    const rawArticles: RawArticle[] = [];
    results.forEach((r, i) => {
      if (r.status === "fulfilled") rawArticles.push(...r.value);
      else console.warn(`Skipping feed ${FEEDS[i].name}:`, r.reason);
    });

    const unique = Array.from(new Map(rawArticles.map((a) => [a.url, a])).values());

    const processedArticles: Array<{
      title: string;
      source: string;
      summary: string;
      summary_brief: string;
      summary_detailed: string;
      tags: string[];
      geographic_scope: string;
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
          title: decodeHtmlEntities(article.title),
          source: article.source,
          summary: enriched[j].summary_brief,
          summary_brief: enriched[j].summary_brief,
          summary_detailed: enriched[j].summary_detailed,
          tags: enriched[j].tags,
          geographic_scope: enriched[j].geographic_scope,
          url: article.url,
          image_url: enriched[j].image_url,
        });
      });
    }

    // Set ignoreDuplicates: false so existing articles update with clean entities
    // Replace 'supabase' with 'supabaseAdmin' to bypass RLS policies during ingestion
const { data, error } = await supabaseAdmin
  .from("articles")
  .upsert(processedArticles, { onConflict: "url", ignoreDuplicates: false })
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

export async function GET() {
  return POST();
}