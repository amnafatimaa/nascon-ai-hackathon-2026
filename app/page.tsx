import Link from "next/link";
import { PaperPreview } from "@/components/newspaper/PaperPreview";

export default function HomePage() {
  return (
    <main className="bg-paper text-ink selection:bg-burgundy selection:text-cream">
      {/* 1. Hero / Masthead Section */}
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-12 md:px-8 md:pt-16">
        {/* Top Kicker Tag */}
        <div className="flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" />
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-burgundy font-semibold">
            A morning paper, set for one reader
          </p>
        </div>

        {/* Masthead Headline */}
        <h1 className="masthead mt-6 text-center font-serif text-6xl font-extrabold leading-none tracking-tight md:text-8xl lg:text-[7.5rem] text-ink hover:text-emerald-deep transition-colors">
          DAYBREAK
        </h1>

        {/* Tagline */}
        <p className="mt-4 text-center font-serif text-xl italic text-ink-soft md:text-2xl">
          Your world. In print. Every morning.
        </p>

        {/* Editorial Double Rule */}
        <div className="double-rule mx-auto mt-8 max-w-3xl" />

        {/* Subtitle / Intro */}
        <p className="mx-auto mt-8 max-w-2xl text-center text-[15px] md:text-[16px] leading-8 text-ink-soft">
          DAYBREAK ingests live news feeds, curates stories using Gemini AI, and
          dynamically ranks them based on your reading preferences to build a
          personalized morning edition in real time.
        </p>

        {/* Action Buttons with Neo-Brutalist Shadow */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/onboarding"
            className="group inline-flex min-w-[220px] items-center justify-center border-2 border-ink bg-ink px-6 py-3.5 text-[11px] font-mono uppercase tracking-[0.2em] text-cream transition-all duration-200 hover:bg-burgundy hover:border-burgundy hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            Create my newspaper
            <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </Link>

          <Link
            href="/paper"
            className="inline-flex min-w-[220px] items-center justify-center border-2 border-ink bg-transparent px-6 py-3.5 text-[11px] font-mono uppercase tracking-[0.2em] text-ink transition-all duration-200 hover:bg-paper-deep hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            Explore today’s edition
          </Link>
        </div>
      </section>

      {/* 2. Feature Spotlight Section (Above the Fold) */}
      <section className="border-y-2 border-ink bg-paper-deep/50">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[0.9fr_1.1fr] md:items-center md:px-8">
          <div>
            <div className="inline-block bg-burgundy/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-burgundy font-semibold mb-3">
              Above the Fold
            </div>
            <h2 className="font-serif text-4xl leading-tight font-bold text-ink md:text-5xl">
              A paper, not a feed.
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-ink-soft">
              Columns, a masthead, a lead story, and desks that feel like real news departments — Technology & Science, World Affairs, and Deep Reads. Designed with intention so you consume news without endless scrolling.
            </p>

            <div className="mt-6 flex items-center gap-4 text-xs font-mono text-muted uppercase tracking-wider">
              <span>✦ Dynamic Ranking</span>
              <span>•</span>
              <span>✦ Gemini Summaries</span>
            </div>
          </div>

          <div className="border border-rule p-2 bg-paper shadow-sm">
            <PaperPreview />
          </div>
        </div>
      </section>

      {/* 3. NEW SECTION: Core Engine Features (Extends the page nicely) */}
      <section className="border-b border-rule bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8">
          <div className="text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-burgundy font-bold">
              Built for Intentional Reading
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
              The Architecture of DAYBREAK
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                tag: "INGESTION",
                title: "Live RSS Feeds",
                desc: "Continuously pulling breaking stories from trusted global outlets including BBC, TechCrunch, Wired, and The Verge.",
              },
              {
                tag: "AI SYNTHESIS",
                title: "Gemini 3.5 Curation",
                desc: "Every article is structured with clean two-sentence summaries and automatic topic-tagging in milliseconds.",
              },
              {
                tag: "EXPORT",
                title: "Print & PDF Edition",
                desc: "Generates a pristine, multi-column paper layout ready to download, save, or read on physical paper.",
              },
            ].map((feature, i) => (
              <div key={i} className="border border-rule bg-paper-deep/30 p-6 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-deep font-bold bg-emerald/10 px-2 py-0.5">
                    {feature.tag}
                  </span>
                  <h3 className="mt-4 font-serif text-2xl font-semibold text-ink">{feature.title}</h3>
                  <p className="mt-3 text-[14px] leading-6 text-ink-soft">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How Personalization Works Section */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-rule pb-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-burgundy font-bold">
              The Personalization Loop
            </p>
            <h2 className="mt-2 font-serif text-4xl font-bold text-ink">Three quiet steps.</h2>
          </div>
          <p className="mt-2 md:mt-0 font-serif italic text-ink-soft text-sm">
            Designed to learn from what you read, without algorithm traps.
          </p>
        </div>

        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {[
            {
              n: "01",
              title: "Name your desks",
              copy: "Choose your primary beats — Artificial Intelligence, Tech, World Affairs, or custom topics.",
            },
            {
              n: "02",
              title: "The paper is gathered",
              copy: "Live RSS feeds pull current stories, processed instantly with AI summaries and automated tagging.",
            },
            {
              n: "03",
              title: "You mark the margins",
              copy: "'More like this' or 'Not interested'. Signals immediately adjust your weights to fold the next edition around your curiosity.",
            },
          ].map((item) => (
            <li key={item.n} className="border-t-2 border-ink pt-6 flex flex-col justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-burgundy font-bold">
                  {item.n}
                </p>
                <h3 className="mt-2 font-serif text-2xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-[14px] leading-7 text-ink-soft">
                  {item.copy}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 5. NEW SECTION: Bottom Editorial Banner / CTA */}
      <section className="border-t-2 border-ink bg-emerald-deep text-cream py-16">
        <div className="mx-auto max-w-4xl text-center px-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream/70">
            Morning Dispatch • Edition 2026
          </p>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl italic font-normal leading-tight">
            "Your news should feel like a morning paper, not a casino."
          </h2>
          <div className="mt-8 flex justify-center">
            <Link
              href="/paper"
              className="inline-flex items-center gap-2 border border-cream bg-cream px-8 py-3.5 text-[11px] font-mono uppercase tracking-[0.2em] text-ink hover:bg-paper transition-all hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]"
            >
              <span>Read Today’s Front Page</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}