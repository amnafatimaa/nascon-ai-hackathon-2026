/**
 * Planned news ingestion layer.
 *
 * Future work: RSS polling, feed normalization, deduplication,
 * and mapping source items onto the shared `Article` type.
 * Nothing here fetches the live web yet.
 */
export type PlannedFeedSource = {
  id: string;
  title: string;
  rssUrl: string;
  homepageUrl: string;
};
