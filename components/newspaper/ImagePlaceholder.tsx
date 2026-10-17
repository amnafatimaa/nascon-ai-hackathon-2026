import {
  Bot,
  Briefcase,
  Clapperboard,
  Code,
  Cpu,
  FlaskConical,
  Globe,
  GraduationCap,
  HeartPulse,
  Leaf,
  Newspaper,
  Rocket,
  Scale,
  ShieldCheck,
  Trophy,
  type LucideIcon,
} from "lucide-react";

// Matched against the lowercased category text, first hit wins.
const ICONS: Array<[string, LucideIcon]> = [
  ["artificial", Bot],
  ["robot", Bot],
  ["cyber", ShieldCheck],
  ["program", Code],
  ["gadget", Cpu],
  ["tech", Cpu],
  ["space", Rocket],
  ["science", FlaskConical],
  ["environment", Leaf],
  ["health", HeartPulse],
  ["business", Briefcase],
  ["politic", Globe],
  ["world", Globe],
  ["education", GraduationCap],
  ["crime", Scale],
  ["sport", Trophy],
  ["entertainment", Clapperboard],
];

function iconFor(category: string): LucideIcon {
  const c = category.toLowerCase();
  return ICONS.find(([key]) => c.includes(key))?.[1] ?? Newspaper;
}

// Shown when an article has no image of its own. A neutral, category-themed tile
// is better than a random stock photo that has nothing to do with the story.
export function ImagePlaceholder({
  category,
  className = "",
}: {
  category: string;
  className?: string;
}) {
  const Icon = iconFor(category);
  return (
    <div
      aria-hidden="true"
      className={`flex flex-col items-center justify-center gap-2 border border-rule bg-paper-deep text-burgundy/50 ${className}`}
    >
      <Icon className="h-10 w-10" strokeWidth={1.25} />
      <span className="text-[10px] uppercase tracking-[0.22em] text-muted">
        {category}
      </span>
    </div>
  );
}
