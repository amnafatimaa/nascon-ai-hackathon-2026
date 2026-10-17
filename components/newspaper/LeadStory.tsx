import { ArticleActions } from "./ArticleActions";
import { formatPublishedTime } from "@/lib/utils";
import type { Article, ArticleFeedbackKind } from "@/lib/types";

export function LeadStory({
  article,
  feedback,
  onFeedback,
  showRelevance,
}: {
  article: Article;
  feedback?: ArticleFeedbackKind;
  onFeedback: (kind: ArticleFeedbackKind) => void;
  showRelevance: boolean;
}) {
  const skipped = feedback === "skip" || feedback === "not_interested";

  return (
    <article
      id={article.id}
      className={`grid gap-8 border-b border-ink pb-10 lg:grid-cols-[1.15fr_0.85fr] ${
        skipped ? "opacity-45" : ""
      }`}
    >
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-burgundy">
          {article.category} · {article.source}
        </p>
        <h2 className="mt-3 font-serif text-4xl leading-[1.12] tracking-tight md:text-5xl">
          {article.title}
        </h2>
        <p className="drop-cap mt-5 text-[17px] leading-8 text-ink-soft">
          {article.summary}
        </p>
        <p className="mt-4 text-[12px] uppercase tracking-[0.16em] text-muted">
          {formatPublishedTime(article.publishedAt)} · Demonstration copy
        </p>
        {showRelevance && article.relevanceExplanation ? (
          <p className="mt-4 border-l-2 border-burgundy pl-3 text-[13px] leading-6 italic text-ink-soft">
            Why this matters to you — {article.relevanceExplanation}
          </p>
        ) : null}
        <ArticleActions
          sourceUrl={article.sourceUrl}
          feedback={feedback}
          onFeedback={onFeedback}
        />
      </div>
      {article.imageUrl ? (
        <figure className="relative min-h-[240px] overflow-hidden border border-rule bg-paper-deep">
          {/* Local SVG illustrations — not news photographs */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl}
            alt=""
            className="h-full min-h-[240px] w-full object-cover"
          />
          <figcaption className="absolute bottom-0 left-0 right-0 bg-ink/70 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-cream">
            Editorial illustration · not a news photograph
          </figcaption>
        </figure>
      ) : null}
    </article>
  );
}
