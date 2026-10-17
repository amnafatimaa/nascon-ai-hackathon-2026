import { padEdition, formatEditionDate } from "@/lib/utils";
import type { Edition } from "@/lib/types";

export function NewspaperHeader({
  edition,
  welcome,
}: {
  edition: Edition;
  welcome: string;
}) {
  return (
    <header className="border-b border-ink pb-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-3 text-[11px] uppercase tracking-[0.18em] text-muted">
        <span>
          Vol. {padEdition(edition.volume)} · No. {padEdition(edition.number)}
        </span>
        <span>{formatEditionDate(edition.date)}</span>
        <span className="text-burgundy">{edition.label}</span>
      </div>

      <p className="masthead mt-6 text-center text-5xl font-medium leading-none text-ink sm:text-6xl md:text-8xl">
        DAYBREAK
      </p>
      <p className="mt-3 text-center font-serif italic text-muted">
        Your world. In print. Every morning.
      </p>

      <div className="double-rule mt-6" />

      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-burgundy">
            {edition.introHeadline}
          </p>
          <p className="mt-2 max-w-2xl font-serif text-2xl leading-snug md:text-[28px]">
            {welcome}
          </p>
        </div>
        <p className="max-w-sm text-[13px] leading-6 text-muted">{edition.intro}</p>
      </div>
    </header>
  );
}
