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
      <div className="flex flex-wrap gap-2">
        {INTEREST_OPTIONS.map((option) => {
          const active = selected.includes(option.slug);
          return (
            <button
              key={option.slug}
              type="button"
              onClick={() => onToggle(option.slug)}
              aria-pressed={active}
              className={cn(
                "border px-3 py-2 text-left text-[13px] transition-colors",
                active
                  ? "border-ink bg-ink text-cream"
                  : "border-rule bg-cream text-ink-soft hover:border-ink",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <form
        className="border-t border-rule pt-6"
        onSubmit={(event) => {
          event.preventDefault();
          onAddCustom();
        }}
      >
        <label htmlFor="custom-interest" className="text-[11px] uppercase tracking-[0.18em] text-muted">
          Add a custom interest
        </label>
        <div className="mt-3 flex gap-2">
          <input
            id="custom-interest"
            value={customDraft}
            onChange={(event) => onCustomDraftChange(event.target.value)}
            placeholder="e.g. Karachi urbanism"
            className="min-w-0 flex-1 border border-rule bg-cream px-3 py-2 text-sm outline-none focus:border-ink"
          />
          <button
            type="submit"
            className="border border-ink bg-ink px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-cream"
          >
            Add
          </button>
        </div>
      </form>

      {customInterests.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {customInterests.map((item) => (
            <li key={item}>
              <button
                type="button"
                onClick={() => onRemoveCustom(item)}
                className="border border-burgundy/40 bg-cream px-3 py-1.5 text-[13px] text-burgundy"
              >
                {item} · remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
