export interface SupabaseArticle {
  id: string | number;
  title: string;
  source: string;
  summary: string;
  tags: string[];
  url: string;
  image_url?: string | null;
  created_at?: string;
  score?: number;
  isLead?: boolean;
}

export type PreferenceWeights = Record<string, number>;

export function rankArticles(
  articles: SupabaseArticle[],
  weights: PreferenceWeights
): SupabaseArticle[] {
  return articles
    .map((article) => {
      let score = 0;
      const tags = Array.isArray(article.tags) ? article.tags : [];

      for (const tag of tags) {
        if (typeof tag !== "string") continue;
        const normalizedTag = tag.toLowerCase().trim();
        if (weights[normalizedTag] !== undefined) {
          score += weights[normalizedTag];
        }
      }

      return { ...article, score };
    })
    .sort((a, b) => {
      const diff = (b.score || 0) - (a.score || 0);
      if (diff !== 0) return diff;
      // tie-break: newest first
      return (b.created_at || "").localeCompare(a.created_at || "");
    });
}