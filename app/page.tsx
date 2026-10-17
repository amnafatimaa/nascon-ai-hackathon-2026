import Link from "next/link";
import { PaperPreview } from "@/components/newspaper/PaperPreview";

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 md:px-8 md:pt-20">
        <p className="text-center text-[11px] uppercase tracking-[0.28em] text-burgundy">
          A morning paper, set for one reader
        </p>
        <h1 className="masthead mt-5 text-center text-6xl font-medium leading-none md:text-8xl lg:text-[7.5rem]">
          DAYBREAK
        </h1>
        <p className="mt-5 text-center font-serif text-xl italic text-ink-soft md:text-2xl">
          Your world. In print. Every morning.
        </p>
        <div className="double-rule mx-auto mt-8 max-w-3xl" />
        <p className="mx-auto mt-8 max-w-2xl text-center text-[16px] leading-8 text-ink-soft">
          DAYBREAK ingests live news feeds, curates stories using Gemini AI, and
          dynamically ranks them based on your reading preferences to build a
          personalized morning edition in real time.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/onboarding"
            className="inline-flex min-w-[220px] items-center justify-center border border-ink bg-ink px-6 py-3 text-[12px] uppercase tracking-[0.2em] text-cream"
          >
            Create my newspaper
          </Link>
          <Link
            href="/paper"
            className="inline-flex min-w-[220px] items-center justify-center border border-ink bg-transparent px-6 py-3 text-[12px] uppercase tracking-[0.2em] text-ink"
          >
            Explore today’s edition
          </Link>
        </div>
      </section>

      <section className="border-y border-rule bg-paper-deep/40">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[0.9fr_1.1fr] md:items-center md:px-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-burgundy">
              Above the fold
            </p>
            <h2 className="mt-3 font-serif text-4xl leading-tight">
              A paper, not a feed.
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-ink-soft">
              Columns, a masthead, a lead story, and desks that feel like
              departments — Technology & Science, the World Desk, the Deep Read.
              The preview beside this note is demonstration type, arranged the
              way a morning edition should feel.
            </p>
          </div>
          <PaperPreview />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-burgundy">
          How personalization will work
        </p>
        <h2 className="mt-3 font-serif text-4xl">Three quiet steps.</h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {[
            {
              n: "01",
              title: "Name your desks",
              copy: "Choose interests and reading length. Those choices stay on this device for now.",
            },
            {
              n: "02",
              title: "The paper is gathered",
              copy: "Live RSS feeds pull current stories, processed instantly with AI summaries and automated tagging.",
            },
            {
              n: "03",
              title: "You mark the margins",
              copy: "More like this, skip, not interested. Signals are stored locally until real learning ships.",
            },
          ].map((item) => (
            <li key={item.n} className="border-t border-ink pt-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
                {item.n}
              </p>
              <h3 className="mt-2 font-serif text-2xl">{item.title}</h3>
              <p className="mt-3 text-[14px] leading-7 text-ink-soft">
                {item.copy}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
