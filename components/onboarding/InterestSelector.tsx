"use client";

import { INTEREST_OPTIONS } from "@/lib/interests";
import { cn } from "@/lib/utils";

export function InterestSelector({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (slug: string) => void;
}) {
  return (
    <div className="space-y-8">
      {/* Standard Interest Chips */}
      <div className="flex flex-wrap gap-2.5">
        {INTEREST_OPTIONS.map((option) => {
          const active = selected.includes(option.slug);
          return (
            <button
              key={option.slug}
              type="button"
              onClick={() => onToggle(option.slug)}
              aria-pressed={active}
              className={cn(
                "border-2 px-3.5 py-2 text-left text-[13px] font-medium transition-all duration-200 cursor-pointer",
                active
                  ? "border-ink bg-ink text-cream shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "border-rule bg-paper-deep/40 text-ink-soft hover:bg-emerald-deep hover:border-emerald-deep hover:text-cream"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}