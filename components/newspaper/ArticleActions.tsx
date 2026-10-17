"use client";

import { ExternalLink, SkipForward, ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ArticleFeedbackKind } from "@/lib/types";

const actions: {
  kind: ArticleFeedbackKind;
  label: string;
  icon: typeof ThumbsUp;
}[] = [
  { kind: "more", label: "More like this", icon: ThumbsUp },
  { kind: "not_interested", label: "Not interested", icon: ThumbsDown },
  { kind: "skip", label: "Skip", icon: SkipForward },
];

export function ArticleActions({
  sourceUrl,
  feedback,
  onFeedback,
}: {
  sourceUrl: string;
  feedback?: ArticleFeedbackKind;
  onFeedback: (kind: ArticleFeedbackKind) => void;
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.14em] text-muted">
      {actions.map((action) => {
        const Icon = action.icon;
        const active = feedback === action.kind;
        return (
          <button
            key={action.kind}
            type="button"
            onClick={() => onFeedback(action.kind)}
            className={cn(
              "inline-flex items-center gap-1.5 hover:text-ink",
              active && "text-burgundy",
            )}
          >
            <Icon size={13} strokeWidth={1.5} />
            {action.label}
          </button>
        );
      })}
      <a
        href={sourceUrl}
        className="inline-flex items-center gap-1.5 text-burgundy hover:text-ink"
      >
        <ExternalLink size={13} strokeWidth={1.5} />
        Read original
      </a>
    </div>
  );
}
