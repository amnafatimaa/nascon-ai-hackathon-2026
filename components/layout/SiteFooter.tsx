export function SiteFooter() {
  return (
    <footer className="mt-auto bg-emerald-deep text-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-9 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="masthead text-[14px] text-cream">DAYBREAK</p>
        <p className="flex items-center gap-3 font-serif text-[15px] italic text-cream/80">
          <span className="ornament" aria-hidden />
          Your world. In print. Every morning.
          <span className="ornament" aria-hidden />
        </p>
        <p className="text-[11px] uppercase tracking-[0.16em] text-cream/60">
          Sample foundation · 2026
        </p>
      </div>
    </footer>
  );
}