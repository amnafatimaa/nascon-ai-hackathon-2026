import { ArticleActions } from "./ArticleActions";
import { formatPublishedTime } from "@/lib/utils";
import type { Article, ArticleFeedbackKind } from "@/lib/types";

export function ArticleCard({
  article,
  feedback,
  onFeedback,
  showRelevance,
  variant = "standard",
}: {
  article: Article;
  feedback?: ArticleFeedbackKind;
  onFeedback: (kind: ArticleFeedbackKind) => void;
  showRelevance: boolean;
  variant?: "standard" | "compact" | "deep";
}) {
  const skipped = feedback === "skip" || feedback === "not_interested";

  return (
    <article
      id={article.id}
      className={`flex h-full flex-col border-rule ${
        variant === "compact" ? "border-t pt-4" : "border-t pt-5"
      } ${skipped ? "opacity-45" : ""}`}
    >
      {article.imageUrl && variant !== "compact" ? (
        <div className="relative mb-4 aspect-[16/9] overflow-hidden border border-rule">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
      <p className="text-[10px] uppercase tracking-[0.2em] text-burgundy">
        {article.category}
      </p>
      <h3
        className={`mt-2 font-serif leading-snug ${
          variant === "deep" ? "text-2xl" : "text-xl"
        }`}
      >
        {article.title}
      </h3>
      <p className="mt-3 flex-1 text-[14px] leading-7 text-ink-soft">
        {article.summary}
      </p>
      <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-muted">
        {article.source} · {formatPublishedTime(article.publishedAt)}
      </p>
      {showRelevance && article.relevanceExplanation ? (
        <p className="mt-3 text-[13px] leading-6 italic text-muted">
          Why this matters to you — {article.relevanceExplanation}
        </p>
      ) : null}
      <ArticleActions
        sourceUrl={article.sourceUrl}
        feedback={feedback}
        onFeedback={onFeedback}
      />
    </article>
  );
}
