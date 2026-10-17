import Link from "next/link";
import { Download, Library } from "lucide-react";
import { ComingSoon } from "@/components/ui/ComingSoon";

export function EditionActions() {
  return (
    <div className="flex flex-wrap items-center gap-6 border-y border-rule py-3 text-[11px] uppercase tracking-[0.16em]">
      <button
  onClick={() => window.print()}
  className="group inline-flex items-center gap-2 rounded-none border-2 border-ink bg-ink px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.15em] text-cream transition-all duration-200 hover:bg-emerald-deep hover:border-emerald-deep hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
>
  <svg 
    className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
  <span>Print / Save PDF</span>
</button>
      <Link
        href="/archive"
        className="inline-flex items-center gap-2 text-ink hover:text-burgundy"
      >
        <Library size={14} strokeWidth={1.5} />
        View previous editions
      </Link>
    </div>
  );
}
