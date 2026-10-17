"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Short labels keep four links on one line on small phones.
const links = [
  { href: "/", label: "Front" },
  { href: "/onboarding", label: "Set up" },
  { href: "/paper", label: "Today" },
  { href: "/archive", label: "Archive" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="flex items-center gap-4 sm:gap-7">
      {links.map((link) => {
        const active =
          link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "border-b pb-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors sm:text-[11px] sm:tracking-[0.18em]",
              active
                ? "border-emerald text-emerald"
                : "border-transparent text-muted hover:text-ink",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}