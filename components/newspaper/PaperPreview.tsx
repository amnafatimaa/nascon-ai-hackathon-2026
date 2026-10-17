import { articles } from "@/lib/mock-data";

export function PaperPreview() {
  const lead = articles[0];
  const rest = articles.slice(1, 4);

  return (
    <aside
      aria-label="Preview of a sample newspaper"
      className="preview-sheet border border-ink bg-cream p-5 md:p-7"
    >
      <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.18em] text-muted">
        <span>Vol. 01 · No. 01</span>
        <span>Sample</span>
      </div>
      <p className="masthead mt-3 text-center text-3xl md:text-4xl">DAYBREAK</p>
      <div className="double-rule mt-3 mb-4" />
      <p className="text-[10px] uppercase tracking-[0.2em] text-burgundy">
        {lead.category}
      </p>
      <h3 className="mt-2 font-serif text-2xl leading-tight">{lead.title}</h3>
      <p className="mt-3 line-clamp-4 text-[13px] leading-6 text-ink-soft">
        {lead.summary}
      </p>
      <div className="mt-5 grid gap-4 border-t border-rule pt-4 sm:grid-cols-3">
        {rest.map((article) => (
          <div key={article.id} className="min-w-0">
            <p className="text-[9px] uppercase tracking-[0.16em] text-burgundy">
              {article.category}
            </p>
            <p className="mt-1 font-serif text-[15px] leading-snug">
              {article.title}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
}
