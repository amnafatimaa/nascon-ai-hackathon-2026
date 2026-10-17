"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Front" },
  { href: "/onboarding", label: "Onboarding" },
  { href: "/paper", label: "Today’s paper" },
  { href: "/archive", label: "Archive" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="flex items-center gap-1.5 sm:gap-2.5">
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
              "px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.16em] transition-all duration-200 sm:text-[11px] sm:tracking-[0.18em] cursor-pointer",
              active
                ? "bg-cream text-ink font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
                : "text-cream/80 hover:bg-cream/15 hover:text-cream border border-transparent"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}