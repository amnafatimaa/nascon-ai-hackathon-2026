import { ArticleActions } from "./ArticleActions";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { formatPublishedTime } from "@/lib/utils";
import type { Article, ArticleFeedbackKind } from "@/lib/types";

export function ArticleCard({
  article,
  feedback,
  onFeedback,
  showRelevance,
  variant = "standard",
  summaryLength = "brief",
}: {
  article: Article & {
    summary_brief?: string;
    summary_detailed?: string;
  };
  feedback?: ArticleFeedbackKind;
  onFeedback: (kind: ArticleFeedbackKind) => void;
  showRelevance: boolean;
  variant?: "standard" | "compact" | "deep";
  summaryLength?: "brief" | "detailed";
}) {
  const skipped = feedback === "skip" || feedback === "not_interested";

  // Dynamic summary pick based on onboarding preference
  const summaryText =
    summaryLength === "detailed" && article.summary_detailed
      ? article.summary_detailed
      : article.summary_brief || article.summary;

  return (
    <article
      id={article.id}
      className={`flex h-full flex-col border-rule ${
        variant === "compact" ? "border-t pt-4" : "border-t pt-5"
      } ${skipped ? "opacity-45" : ""}`}
    >
      {variant !== "compact" ? (
        article.imageUrl ? (
          <div className="relative mb-4 aspect-[16/9] overflow-hidden border border-rule bg-paper-deep">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.imageUrl}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
              onError={(e) =>
                e.currentTarget.parentElement?.classList.add("hidden")
              }
            />
          </div>
        ) : (
          <ImagePlaceholder
            category={article.category}
            className="mb-4 aspect-[16/9]"
          />
        )
      ) : null}

      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-burgundy font-semibold">
        <span>{article.category}</span>
        <span className="text-muted">•</span>
        <span className="text-ink-soft">{article.source}</span>
      </div>

      <h3
        className={`mt-2 font-serif leading-snug font-bold ${
          variant === "deep" ? "text-2xl" : "text-xl"
        }`}
      >
        <a
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="decoration-1 underline-offset-4 hover:underline text-ink hover:text-emerald-deep transition-colors"
        >
          {article.title}
        </a>
      </h3>

      <p className="mt-3 flex-1 text-[14px] leading-7 text-ink-soft font-serif">
        {summaryText}
      </p>

      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
        {article.source} · {formatPublishedTime(article.publishedAt)}
      </p>

      {showRelevance && article.relevanceExplanation ? (
        <p className="mt-3 text-[12px] font-mono leading-5 italic text-muted border-l-2 border-emerald pl-2">
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