import { cn } from "@/lib/utils";

export function ProgressRail({
  step,
  total,
  labels,
}: {
  step: number;
  total: number;
  labels: string[];
}) {
  return (
    <ol className="grid grid-cols-4 gap-2 border-b border-rule pb-4">
      {labels.map((label, index) => {
        const current = index + 1;
        const done = current <= step;
        return (
          <li key={label} className="min-w-0">
            <p
              className={cn(
                "text-[10px] uppercase tracking-[0.18em]",
                done ? "text-burgundy" : "text-muted",
              )}
            >
              {String(current).padStart(2, "0")}
            </p>
            <p
              className={cn(
                "mt-1 truncate font-serif text-sm",
                done ? "text-ink" : "text-muted",
              )}
            >
              {label}
            </p>
            <span
              className={cn(
                "mt-3 block h-[2px]",
                done ? "bg-burgundy" : "bg-rule",
              )}
            />
          </li>
        );
      })}
      <span className="sr-only">
        Step {step} of {total}
      </span>
    </ol>
  );
}
