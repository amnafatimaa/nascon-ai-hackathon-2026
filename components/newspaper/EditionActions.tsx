import Link from "next/link";
import { Download, Library } from "lucide-react";
import { ComingSoon } from "@/components/ui/ComingSoon";

export function EditionActions() {
  return (
    <div className="flex flex-wrap items-center gap-6 border-y border-rule py-3 text-[11px] uppercase tracking-[0.16em]">
      <button
  onClick={() => window.print()}
  className="inline-flex items-center gap-2 rounded-sm border border-ink bg-ink px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-cream transition-all hover:bg-burgundy hover:border-burgundy active:scale-95 cursor-pointer shadow-sm"
>
  <svg 
    className="w-3.5 h-3.5" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" 
    />
  </svg>
  <span>Download PDF / Print Edition</span>
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
