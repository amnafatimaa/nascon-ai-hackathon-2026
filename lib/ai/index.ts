/**
 * Planned AI layer.
 *
 * Future work: summarization, categorization, and tagging.
 * The UI must not claim these capabilities are live while
 * the newspaper is still rendered from demonstration data.
 */
export type PlannedSummaryRequest = {
  articleId: string;
  rawText: string;
  targetLength: "brief" | "detailed";
};
