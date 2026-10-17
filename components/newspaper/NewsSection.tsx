import { ArticleCard } from "./ArticleCard";
import type { Article, ArticleFeedbackKind, NewsSection as NewsSectionType } from "@/lib/types";

export function NewsSection({
  section,
  articles,
  feedback,
  onFeedback,
  showRelevance,
}: {
  section: NewsSectionType;
  articles: Article[];
  feedback: Record<string, ArticleFeedbackKind>;
  onFeedback: (articleId: string, kind: ArticleFeedbackKind) => void;
  showRelevance: boolean;
}) {
  const deep = section.id === "deep-read";

  return (
    <section className="pt-10">
      <div className="border-y border-ink py-4">
        <p className="text-[11px] uppercase tracking-[0.22em] text-burgundy">
          {section.kicker}
        </p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-serif text-3xl md:text-4xl">{section.title}</h2>
          <p className="max-w-md text-[13px] leading-6 text-muted">
            {section.description}
          </p>
        </div>
      </div>

      <div
        className={`mt-6 grid gap-x-8 gap-y-6 ${
          deep ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3"
        }`}
      >
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            variant={deep ? "deep" : "standard"}
            feedback={feedback[article.id]}
            onFeedback={(kind) => onFeedback(article.id, kind)}
            showRelevance={showRelevance}
          />
        ))}
      </div>
    </section>
  );
}
