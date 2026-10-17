import { ArticleActions } from "./ArticleActions";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { formatPublishedTime } from "@/lib/utils";
import type { Article, ArticleFeedbackKind } from "@/lib/types";

export function LeadStory({
  article,
  feedback,
  onFeedback,
  showRelevance,
  summaryLength = "brief",
}: {
  article: Article & {
    summary_brief?: string;
    summary_detailed?: string;
  };
  feedback?: ArticleFeedbackKind;
  onFeedback: (kind: ArticleFeedbackKind) => void;
  showRelevance: boolean;
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
      className={`border-b-2 border-ink pb-10 ${skipped ? "opacity-45" : ""}`}
    >
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-burgundy font-bold">
        <span className="bg-burgundy/10 px-2 py-0.5">Lead Story</span>
        <span>•</span>
        <span>{article.category}</span>
        <span>•</span>
        <span className="text-ink-soft">{article.source}</span>
      </div>

      <h2 className="mt-3 font-serif text-4xl font-extrabold leading-[1.12] tracking-tight md:text-5xl text-ink">
        <a
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="decoration-1 underline-offset-4 hover:underline hover:text-emerald-deep transition-colors"
        >
          {article.title}
        </a>
      </h2>

      {article.imageUrl ? (
        <figure className="mt-6 overflow-hidden border-2 border-ink bg-paper-deep shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="relative aspect-[16/9]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.imageUrl}
              alt=""
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) =>
                e.currentTarget.closest("figure")?.classList.add("hidden")
              }
            />
          </div>
          <figcaption className="border-t border-rule px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
            Image via {article.source}
          </figcaption>
        </figure>
      ) : (
        <ImagePlaceholder
          category={article.category}
          className="mt-6 aspect-[21/9] border-2 border-ink"
        />
      )}

      <p className="drop-cap mt-6 text-[17px] leading-8 text-ink-soft font-serif">
        {summaryText}
      </p>

      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
        {formatPublishedTime(article.publishedAt)}
      </p>

      {showRelevance && article.relevanceExplanation ? (
        <p className="mt-4 border-l-2 border-burgundy pl-3 font-mono text-[12px] leading-6 italic text-ink-soft">
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