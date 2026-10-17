"use client";

import type { ArticleFeedbackKind } from "@/lib/types";
import { ThumbsUp, ThumbsDown, ExternalLink } from "lucide-react";

export function ArticleActions({
  sourceUrl,
  feedback,
  onFeedback,
}: {
  sourceUrl?: string;
  feedback?: ArticleFeedbackKind;
  onFeedback: (kind: ArticleFeedbackKind) => void;
}) {
  const isMore =
    (feedback as string) === "more_like_this" || (feedback as string) === "more";
  const isLess =
    feedback === "not_interested" || (feedback as string) === "less";

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-rule pt-3 text-[12px] font-sans">
      {sourceUrl ? (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 whitespace-nowrap font-medium text-burgundy hover:underline cursor-pointer"
        >
          Read Original <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <span />
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-pressed={isMore}
          onClick={(e) => {
            e.stopPropagation();
            onFeedback("more");
          }}
          className={`flex items-center gap-1 whitespace-nowrap rounded px-2.5 py-1 transition cursor-pointer font-medium ${
            isMore
              ? "bg-emerald-700 text-white font-bold"
              : "bg-stone-200 text-stone-700 hover:bg-emerald-100 hover:text-emerald-800"
          }`}
        >
          <ThumbsUp className="h-3.5 w-3.5" /> More like this
        </button>

        <button
          type="button"
          aria-pressed={isLess}
          onClick={(e) => {
            e.stopPropagation();
            onFeedback("not_interested");
          }}
          className={`flex items-center gap-1 whitespace-nowrap rounded px-2.5 py-1 transition cursor-pointer font-medium ${
            isLess
              ? "bg-rose-700 text-white font-bold"
              : "bg-stone-200 text-stone-700 hover:bg-rose-100 hover:text-rose-800"
          }`}
        >
          <ThumbsDown className="h-3.5 w-3.5" /> Not interested
        </button>
      </div>
    </div>
  );
}