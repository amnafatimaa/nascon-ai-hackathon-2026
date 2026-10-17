import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

function parseSafeDate(isoDate?: string | Date | null): Date | null {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  return isNaN(date.getTime()) ? null : date;
}

export function formatEditionDate(isoDate?: string | Date | null) {
  const date = parseSafeDate(isoDate);
  if (!date) return "Today's Edition";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatShortDate(isoDate?: string | Date | null) {
  const date = parseSafeDate(isoDate);
  if (!date) return "Recent";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatPublishedTime(isoDate?: string | Date | null) {
  const date = parseSafeDate(isoDate);
  if (!date) return "Recently";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function padEdition(number: number) {
  return String(number).padStart(2, "0");
}

export function interestLabel(value: string) {
  return value
    .split(/[-_]/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}