import type { Metadata } from "next";
import Link from "next/link";
import { archiveEditions, storyCountForEdition } from "@/lib/mock-data";
import { formatEditionDate, padEdition } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Archive",
};

export default function ArchivePage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <p className="text-[11px] uppercase tracking-[0.22em] text-burgundy">
        The bound volumes
      </p>
      <h1 className="mt-3 font-serif text-5xl">Previous editions</h1>
      <p className="mt-4 max-w-2xl text-[16px] leading-7 text-ink-soft">
        Historical morning papers will live here once daily editions are
        persisted. What follows is demonstration data — printer’s proofs and
        dummy issues used to design the archive, not a record of real days.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {archiveEditions.map((edition) => {
          const count = storyCountForEdition(edition);
          const isToday = edition.id === "edition-2026-10-17";
          return (
            <article
              key={edition.id}
              className="flex flex-col border border-ink bg-cream p-6"
            >
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-muted">
                <span>
                  Vol. {padEdition(edition.volume)} · No.{" "}
                  {padEdition(edition.number)}
                </span>
                <span className="text-burgundy">{edition.label}</span>
              </div>
              <h2 className="masthead mt-4 text-3xl">DAYBREAK</h2>
              <p className="mt-2 font-serif text-xl">{edition.introHeadline}</p>
              <p className="mt-2 text-[13px] text-muted">
                {formatEditionDate(edition.date)} · {count} stor
                {count === 1 ? "y" : "ies"} · demonstration
              </p>
              <p className="mt-4 flex-1 text-[14px] leading-6 text-ink-soft">
                {edition.intro}
              </p>
              {isToday ? (
                <Link
                  href="/paper"
                  className="mt-6 inline-flex w-fit border border-ink bg-ink px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-cream"
                >
                  Open this edition
                </Link>
              ) : (
                <p className="mt-6 text-[11px] uppercase tracking-[0.16em] text-muted">
                  Bound sample · not yet openable
                </p>
              )}
            </article>
          );
        })}
      </div>
    </main>
  );
}
