/**
 * Shared data model for DAYBREAK.
 *
 * These types are designed to survive the move from demonstration data
 * to RSS ingestion, AI summarization, ranking, and persisted editions.
 * They do not imply that those systems are implemented yet.
 */

// Slugs must match the TAXONOMY in app/api/ingest/route.ts exactly.
export type InterestSlug =
  | "artificial-intelligence"
  | "technology"
  | "programming"
  | "robotics"
  | "gadgets"
  | "cybersecurity"
  | "science"
  | "space"
  | "environment"
  | "health"
  | "business"
  | "politics"
  | "world-affairs"
  | "education"
  | "crime"
  | "sports"
  | "entertainment"
  | "general"
  | "finance"
  | "pakistan"
  | "climate"
  | "culture"
  | "gaming";

export type SummaryLength = "brief" | "detailed";
export type EditionSize = "short" | "comprehensive";
export type GeographicFocus = "local" | "balanced" | "global";

export type ArticleFeedbackKind = "more" | "not_interested" | "skip";

export interface Article {
  id: string;
  title: string;
  summary: string;
  source: string;
  /** Demonstration or future canonical URL. Never treat as verified reporting. */
  sourceUrl: string;
  publishedAt: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  relevanceExplanation?: string;
  isLead?: boolean;
}

export interface NewsSection {
  id: string;
  kicker: string;
  title: string;
  description: string;
  articleIds: string[];
}

export interface Edition {
  id: string;
  number: number;
  volume: number;
  label: string;
  date: string;
  introHeadline: string;
  intro: string;
  sectionIds: string[];
  isSample: true;
}

export interface OnboardingPreferences {
  interests: string[];
  customInterests: string[];
  summaryLength: SummaryLength;
  editionSize: EditionSize;
  geographicFocus: GeographicFocus;
  completed: boolean;
  updatedAt: string;
}

export interface ArticleFeedbackMap {
  [articleId: string]: ArticleFeedbackKind;
}
