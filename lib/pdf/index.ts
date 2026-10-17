/**
 * Planned PDF generation layer.
 *
 * Future work: render a daily edition to a downloadable newspaper PDF.
 * The current Download control is intentionally marked coming soon.
 */
export type PlannedPdfJob = {
  editionId: string;
  format: "tabloid" | "letter";
};
