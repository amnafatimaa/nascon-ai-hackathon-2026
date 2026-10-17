import Link from "next/link";
import { Navigation } from "./Navigation";

export function Header() {
  return (
    <header className="border-b border-rule border-t-[3px] border-t-emerald bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3.5 md:px-8">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="masthead text-[15px] text-emerald-deep">
            DAYBREAK
          </span>
          <span className="meta hidden !text-[10px] uppercase tracking-[0.22em] sm:inline">
            Morning edition
          </span>
        </Link>
        <Navigation />
      </div>
    </header>
  );
}