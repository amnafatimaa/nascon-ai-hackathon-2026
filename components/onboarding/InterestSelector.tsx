"use client";

import { INTEREST_OPTIONS } from "@/lib/interests";
import { cn } from "@/lib/utils";

export function InterestSelector({
  selected,
  customInterests,
  customDraft,
  onToggle,
  onCustomDraftChange,
  onAddCustom,
  onRemoveCustom,
}: {
  selected: string[];
  customInterests: string[];
  customDraft: string;
  onToggle: (slug: string) => void;
  onCustomDraftChange: (value: string) => void;
  onAddCustom: () => void;
  onRemoveCustom: (value: string) => void;
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

      {/* Custom Interest Input Form */}
      <form
        className="border-t-2 border-ink pt-6"
        onSubmit={(event) => {
          event.preventDefault();
          onAddCustom();
        }}
      >
        <label
          htmlFor="custom-interest"
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted font-bold block"
        >
          Add a custom interest or beat
        </label>
        <div className="mt-3 flex gap-2">
          <input
            id="custom-interest"
            value={customDraft}
            onChange={(event) => onCustomDraftChange(event.target.value)}
            placeholder="e.g. Karachi urbanism, Quantum Computing"
            className="min-w-0 flex-1 border-2 border-rule bg-paper-deep/20 px-3.5 py-2 text-sm text-ink outline-none transition-colors focus:border-ink placeholder:text-muted/60"
          />
          <button
            type="submit"
            className="border-2 border-ink bg-ink px-5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-cream transition-all hover:bg-emerald-deep hover:border-emerald-deep hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          >
            Add Beat
          </button>
        </div>
      </form>

      {/* Custom Selected Badges */}
      {customInterests.length > 0 ? (
        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted font-bold">
            Custom Desks Added:
          </p>
          <ul className="flex flex-wrap gap-2">
            {customInterests.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => onRemoveCustom(item)}
                  className="group inline-flex items-center gap-1.5 border-2 border-burgundy/40 bg-paper-deep/60 px-3 py-1 text-[12px] font-mono text-burgundy transition-all hover:bg-emerald-deep hover:border-emerald-deep hover:text-cream cursor-pointer"
                >
                  <span>{item}</span>
                  <span className="text-[10px] opacity-70 group-hover:opacity-100">✕</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}