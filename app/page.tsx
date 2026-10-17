import Link from "next/link";
import { PaperPreview } from "@/components/newspaper/PaperPreview";

const STEPS = [
  {
    n: "I",
    title: "Name your desks",
    copy: "Choose your interests and how much you like to read. These choices stay on this device for now.",
  },
  {
    n: "II",
    title: "The paper is gathered",
    copy: "Later: feeds, summaries, and ranking. Today: a designed sample edition built from mock stories.",
  },
  {
    n: "III",
    title: "You mark the margins",
    copy: "More like this, skip, not interested. Signals are stored locally until real learning ships.",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Masthead */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 md:px-8 md:pt-20">
        <p className="kicker text-center !tracking-[0.28em]">
          A morning paper, set for one reader
        </p>
        <h1 className="masthead mt-5 text-center text-6xl leading-none md:text-8xl lg:text-[7.5rem]">
          DAYBREAK
        </h1>
        <p className="mt-5 text-center font-serif text-xl italic text-ink-soft md:text-2xl">
          Your world. In print. Every morning.
        </p>
        <div className="double-rule mx-auto mt-8 max-w-3xl" />
        <p className="prose-body mx-auto mt-8 max-w-2xl text-center">
          DAYBREAK gathers stories from many desks, learns what you care about,
          and sets a personalized newspaper you can actually read. This
          foundation is the masthead, the composing room, and a sample edition,
          not a live newsroom yet.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/onboarding" className="btn-primary min-w-[240px]">
            Create my newspaper
          </Link>
          <Link href="/paper" className="btn-secondary min-w-[240px]">
            Explore today’s edition
          </Link>
        </div>
      </section>

      {/* Preview */}
      <section className="border-y border-rule bg-paper-deep/50">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[0.9fr_1.1fr] md:items-center md:px-8">
          <div>
            <p className="kicker">Above the fold</p>
            <h2 className="headline mt-3 text-4xl">A paper, not a feed.</h2>
            <p className="prose-body mt-4">
              Columns, a masthead, a lead story, and desks that feel like
              departments: Technology &amp; Science, the World Desk, the Deep
              Read. The preview beside this note is demonstration type,
              arranged the way a morning edition should feel.
            </p>
          </div>
          <PaperPreview />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <div className="flex items-center gap-3">
          <span className="ornament" aria-hidden />
          <p className="kicker">How personalization will work</p>
        </div>
        <h2 className="headline mt-3 text-4xl">Three quiet steps.</h2>
        <ol className="column-rule mt-10 grid gap-8 md:grid-cols-3 lg:gap-6">
          {STEPS.map((item) => (
            <li key={item.n} className="border-t border-ink pt-5 lg:border-t-0 lg:pt-0">
              <p className="font-serif text-lg italic text-brass">{item.n}</p>
              <h3 className="headline mt-1 text-2xl">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-7 text-ink-soft">
                {item.copy}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}