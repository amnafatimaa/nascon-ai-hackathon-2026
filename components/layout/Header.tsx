"use client";

import Link from "next/link";
import { Navigation } from "./Navigation";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-emerald-deep text-cream backdrop-blur-sm transition-all shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        
        {/* Brand / Logo Section */}
        <Link 
          href="/" 
          className="group flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          {/* Masthead Title using the standard masthead font styling */}
          <span className="masthead text-lg md:text-xl font-normal tracking-wider !text-cream group-hover:text-cream/80 transition-colors">
            DAYBREAK
          </span>

          {/* Micro Divider */}
          <span className="hidden sm:inline text-cream/30 text-xs font-light">|</span>

          {/* Monospace Vintage Badge */}
          <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-cream/90 bg-cream/10 px-2 py-0.5 border border-cream/20 rounded-none">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
            Morning Edition
          </span>
        </Link>

        {/* Navigation Bar */}
        <Navigation />

      </div>
    </header>
  );
}