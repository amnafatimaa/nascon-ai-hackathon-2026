export function ComingSoon({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      {children}
      <span className="border border-rule px-1.5 py-0.5 text-[9px] uppercase tracking-[0.18em] text-muted">
        Coming soon
      </span>
    </span>
  );
}
