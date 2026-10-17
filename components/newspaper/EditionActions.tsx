import Link from "next/link";
import { Download, Library } from "lucide-react";
import { ComingSoon } from "@/components/ui/ComingSoon";

export function EditionActions() {
  return (
    <div className="flex flex-wrap items-center gap-6 border-y border-rule py-3 text-[11px] uppercase tracking-[0.16em]">
      <ComingSoon>
        <span className="inline-flex items-center gap-2 text-muted">
          <Download size={14} strokeWidth={1.5} />
          Download PDF
        </span>
      </ComingSoon>
      <Link href="/archive" className="inline-flex items-center gap-2 text-ink hover:text-burgundy">
        <Library size={14} strokeWidth={1.5} />
        View previous editions
      </Link>
    </div>
  );
}
