import { ArticleActions } from "./ArticleActions";
import { ImagePlaceholder } from "./ImagePlaceholder";
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
      className={`border-b border-ink pb-10 ${skipped ? "opacity-45" : ""}`}
    >
      <p className="text-[11px] uppercase tracking-[0.22em] text-burgundy">
        {article.category} · {article.source}
      </p>

      <h2 className="mt-3 font-serif text-4xl leading-[1.12] tracking-tight md:text-5xl">
        <a
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="decoration-1 underline-offset-4 hover:underline"
        >
          {article.title}
        </a>
      </h2>

      {article.imageUrl ? (
        <figure className="mt-6 overflow-hidden border border-rule bg-paper-deep">
          <div className="relative aspect-[16/9]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.imageUrl}
              alt=""
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full object-cover"
              // Dead or hotlink-blocked image: hide the figure rather than show a broken icon.
              onError={(e) => e.currentTarget.closest("figure")?.classList.add("hidden")}
            />
          </div>
          <figcaption className="border-t border-rule px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-muted">
            Image via {article.source}
          </figcaption>
        </figure>
      ) : (
        <ImagePlaceholder category={article.category} className="mt-6 aspect-[21/9]" />
      )}

      <p className="drop-cap mt-6 text-[17px] leading-8 text-ink-soft">
        {article.summary}
      </p>

      <p className="mt-4 text-[12px] uppercase tracking-[0.16em] text-muted">
        {formatPublishedTime(article.publishedAt)}
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
    </article>
  );
}