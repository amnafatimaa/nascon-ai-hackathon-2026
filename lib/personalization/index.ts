/**
 * Planned ranking and preference-learning layer.
 *
 * Future work: score articles against an interest profile,
 * incorporate “more like this” / “not interested” signals,
 * and produce a per-reader edition.
 */
export type PlannedInterestProfile = {
  interests: string[];
  weights: Record<string, number>;
};
