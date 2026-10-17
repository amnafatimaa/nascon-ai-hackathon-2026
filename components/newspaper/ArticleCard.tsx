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
              // Dead or hotlink-blocked image: hide the box rather than show a broken icon.
              onError={(e) => e.currentTarget.parentElement?.classList.add("hidden")}
            />
          </div>
        ) : (
          <ImagePlaceholder
            category={article.category}
            className="mb-4 aspect-[16/9]"
          />
        )
      ) : null}

      <p className="text-[10px] uppercase tracking-[0.2em] text-burgundy">
        {article.category}
      </p>

      <h3
        className={`mt-2 font-serif leading-snug ${
          variant === "deep" ? "text-2xl" : "text-xl"
        }`}
      >
        <a
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="decoration-1 underline-offset-4 hover:underline"
        >
          {article.title}
        </a>
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