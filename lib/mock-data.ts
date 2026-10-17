/**
 * DEMONSTRATION DATA ONLY.
 *
 * This file is the temporary stand-in for news ingestion, summarization,
 * ranking, and persisted daily editions. Headlines and summaries are
 * invented for product design. They are not verified reporting.
 *
 * Source URLs point to in-app demonstration pages, not publisher sites.
 */

import type { Article, Edition, NewsSection } from "./types";

export const DEMO_NOTICE =
  "Sample edition for product development. Stories are demonstration copy, not live news.";

export const articles: Article[] = [
  {
    id: "lead-open-models",
    title:
      "Open models are quietly rewriting the morning briefing, one newsroom at a time",
    summary:
      "A demonstration lead: smaller editorial teams are experimenting with open language models to cluster overnight wires, draft briefs, and leave more hours for reporting. The question is no longer whether machines can summarize — it is who decides what belongs on the front page.",
    source: "The Daybreak Desk",
    sourceUrl: "/paper#lead-open-models",
    publishedAt: "2026-10-17T05:10:00.000Z",
    category: "Artificial Intelligence",
    tags: ["artificial-intelligence", "technology", "programming"],
    imageUrl: "/images/lead-sunrise.svg",
    relevanceExplanation:
      "Selected because you follow artificial intelligence and the tools that shape how news is made.",
    isLead: true,
  },
  {
    id: "chip-diplomacy",
    title: "The new geography of chips is a study in patience, ports, and power",
    summary:
      "Demonstration brief: fabrication plants, export rules, and university labs are redrawing which cities matter in computing. The map is less a race than a slow rearrangement of talent and capital.",
    source: "Pacific Ledger",
    sourceUrl: "/paper#chip-diplomacy",
    publishedAt: "2026-10-17T04:40:00.000Z",
    category: "Technology",
    tags: ["technology", "business", "world-news"],
    imageUrl: "/images/circuit-grid.svg",
    relevanceExplanation: "Touches technology supply chains and global business in the same column.",
  },
  {
    id: "karachi-heat",
    title: "Karachi’s nights keep the heat, and the city is rewriting its mornings",
    summary:
      "A sample local desk item: warmer nights, strained grids, and civic experiments in shade and water. The story is not only climate science — it is how a coastal metropolis changes its daily rhythm.",
    source: "Indus Morning",
    sourceUrl: "/paper#karachi-heat",
    publishedAt: "2026-10-16T21:15:00.000Z",
    category: "Pakistan",
    tags: ["pakistan", "climate", "health"],
    imageUrl: "/images/harbor-dawn.svg",
    relevanceExplanation: "Written for readers who asked for Pakistan and climate in the same edition.",
  },
  {
    id: "robot-lab",
    title: "In a warehouse on the edge of town, the robots are learning to hesitate",
    summary:
      "Demonstration science feature: hesitation, it turns out, is a useful industrial skill. Research groups are training machines to pause before a bad grasp — a small delay that could spare a great deal of broken glass.",
    source: "Workshop Review",
    sourceUrl: "/paper#robot-lab",
    publishedAt: "2026-10-16T19:05:00.000Z",
    category: "Robotics",
    tags: ["robotics", "science", "programming"],
    imageUrl: "/images/workshop.svg",
  },
  {
    id: "market-quiet",
    title: "Markets open quietly as investors wait on a week of ordinary numbers",
    summary:
      "Sample markets note: futures barely moved, bond traders argued about a tenth of a percent, and the more interesting story sat in shipping insurance. A reminder that finance is often a study in waiting.",
    source: "Ledger & Co.",
    sourceUrl: "/paper#market-quiet",
    publishedAt: "2026-10-17T06:00:00.000Z",
    category: "Finance",
    tags: ["finance", "business"],
  },
  {
    id: "space-dust",
    title: "A thimble of asteroid dust, and a decade of waiting, reach the lab bench",
    summary:
      "Demonstration science copy: returned samples are unglamorous until they are not. Mineral maps from a distant rock are helping researchers argue, politely, about how water arrived on worlds like ours.",
    source: "Observatory Post",
    sourceUrl: "/paper#space-dust",
    publishedAt: "2026-10-16T16:30:00.000Z",
    category: "Space",
    tags: ["space", "science"],
    imageUrl: "/images/observatory.svg",
    relevanceExplanation: "A deep read for anyone who marked space or science during onboarding.",
  },
  {
    id: "monsoon-vote",
    title: "A monsoon, a budget, and the slow work of making policy feel local",
    summary:
      "Sample world/politics brief: lawmakers are arguing about irrigation, fuel, and school calendars in the same afternoon. The weather is not a metaphor. It is on the docket.",
    source: "Capitol Wire",
    sourceUrl: "/paper#monsoon-vote",
    publishedAt: "2026-10-16T14:20:00.000Z",
    category: "Politics",
    tags: ["politics", "world-news", "pakistan", "climate"],
  },
  {
    id: "clinic-ai",
    title: "Clinics try a quieter kind of triage, with a human still at the desk",
    summary:
      "Demonstration health story: intake forms are being sorted by software, then read by nurses. Early pilots promise shorter waits, provided the model is honest about what it does not know.",
    source: "Public Health Brief",
    sourceUrl: "/paper#clinic-ai",
    publishedAt: "2026-10-16T11:45:00.000Z",
    category: "Health",
    tags: ["health", "artificial-intelligence"],
  },
  {
    id: "game-cities",
    title: "Players are building cities that remember yesterday’s weather",
    summary:
      "Sample culture/gaming note: a new simulation lets storms persist across sessions. Designers say the point is not realism so much as consequence — a city that cannot forget the flood.",
    source: "Arcade Folio",
    sourceUrl: "/paper#game-cities",
    publishedAt: "2026-10-15T22:10:00.000Z",
    category: "Gaming",
    tags: ["gaming", "culture", "climate"],
    imageUrl: "/images/city-grid.svg",
  },
  {
    id: "shipping-lanes",
    title: "Rerouted freighters draw a new atlas of delay across the Indian Ocean",
    summary:
      "Demonstration world desk: insurance rates, crew rest rules, and a handful of canals are reshaping grocery prices two months downstream. The map in the newsroom is covered in string.",
    source: "Harbor Telegram",
    sourceUrl: "/paper#shipping-lanes",
    publishedAt: "2026-10-16T08:00:00.000Z",
    category: "World News",
    tags: ["world-news", "business", "climate"],
    imageUrl: "/images/shipping.svg",
  },
  {
    id: "open-source-week",
    title: "A week in the commit log: maintainers, burnout, and a quieter kind of fame",
    summary:
      "Sample programming feature: the most-used libraries in the stack are still tended by people who answer mail at odd hours. The story follows one release, from patch to applause to silence.",
    source: "Commit Record",
    sourceUrl: "/paper#open-source-week",
    publishedAt: "2026-10-15T18:40:00.000Z",
    category: "Programming",
    tags: ["programming", "technology", "culture"],
  },
  {
    id: "museum-night",
    title: "After hours, a museum lets the labels argue with one another",
    summary:
      "Demonstration culture piece: an exhibition of contested captions asks visitors to choose a sentence and live with it. The art is familiar. The wall text is not.",
    source: "Evening Gazette",
    sourceUrl: "/paper#museum-night",
    publishedAt: "2026-10-15T20:00:00.000Z",
    category: "Culture",
    tags: ["culture"],
  },
  {
    id: "bubble-agriculture",
    title: "Beyond the timeline: a harvest story you did not ask for, on purpose",
    summary:
      "Sample ‘beyond your bubble’ item: a cooperative in the highlands is measuring soil carbon with clipboards and a shared spreadsheet. It is not trending. It is, however, how a great deal of the world still works.",
    source: "Rural Desk",
    sourceUrl: "/paper#bubble-agriculture",
    publishedAt: "2026-10-15T09:30:00.000Z",
    category: "World News",
    tags: ["world-news", "climate", "science"],
    relevanceExplanation:
      "Included to step outside your usual mix — a world story that is not optimized for your clicks.",
  },
];

export const sections: NewsSection[] = [
  {
    id: "front-page",
    kicker: "Vol. I  ·  The morning edition",
    title: "The Front Page",
    description: "The stories we would put above the fold in a printed paper.",
    articleIds: ["lead-open-models", "chip-diplomacy", "karachi-heat"],
  },
  {
    id: "tech-science",
    kicker: "Laboratory & circuit",
    title: "Technology & Science",
    description: "Machines, measurements, and the people who keep both honest.",
    articleIds: ["robot-lab", "space-dust", "clinic-ai", "open-source-week"],
  },
  {
    id: "world-desk",
    kicker: "Dispatches",
    title: "The World Desk",
    description: "Ports, parliaments, and the weather that will not stay off the docket.",
    articleIds: ["shipping-lanes", "monsoon-vote", "market-quiet"],
  },
  {
    id: "deep-read",
    kicker: "Sunday length, weekday hour",
    title: "The Deep Read",
    description: "Longer pieces meant to be read with coffee, not between notifications.",
    articleIds: ["open-source-week", "museum-night"],
  },
  {
    id: "beyond-bubble",
    kicker: "A wider paper",
    title: "Beyond Your Bubble",
    description: "One story chosen to sit outside the interests you already named.",
    articleIds: ["bubble-agriculture", "game-cities"],
  },
];

export const todaysEdition: Edition = {
  id: "edition-2026-10-17",
  number: 1,
  volume: 1,
  label: "Sample morning edition",
  date: "2026-10-17T06:00:00.000Z",
  introHeadline: "A paper folded to your curiosity",
  intro:
    "This is a demonstration edition of DAYBREAK. The columns, bylines, and timestamps are staged so the reading experience can be designed before live ingestion is connected.",
  sectionIds: [
    "front-page",
    "tech-science",
    "world-desk",
    "deep-read",
    "beyond-bubble",
  ],
  isSample: true,
};

export const archiveEditions: Edition[] = [
  todaysEdition,
  {
    id: "edition-2026-10-16",
    number: 0,
    volume: 1,
    label: "Printer’s proof",
    date: "2026-10-16T06:00:00.000Z",
    introHeadline: "Yesterday’s rehearsal",
    intro: "A thinner proof used to test archive layout. Demonstration only.",
    sectionIds: ["front-page", "tech-science"],
    isSample: true,
  },
  {
    id: "edition-2026-10-15",
    number: 0,
    volume: 1,
    label: "Studio dummy",
    date: "2026-10-15T06:00:00.000Z",
    introHeadline: "Columns without a press run",
    intro: "A dummy edition for the archive grid. Demonstration only.",
    sectionIds: ["world-desk", "beyond-bubble"],
    isSample: true,
  },
  {
    id: "edition-2026-10-14",
    number: 0,
    volume: 1,
    label: "Type specimen",
    date: "2026-10-14T06:00:00.000Z",
    introHeadline: "Masthead studies",
    intro: "Held in the archive to show how previous mornings will eventually appear.",
    sectionIds: ["deep-read"],
    isSample: true,
  },
];

const articleById = new Map(articles.map((article) => [article.id, article]));
const sectionById = new Map(sections.map((section) => [section.id, section]));

export function getArticle(id: string) {
  return articleById.get(id);
}

export function getSection(id: string) {
  return sectionById.get(id);
}

export function articlesForSection(section: NewsSection) {
  return section.articleIds
    .map((id) => articleById.get(id))
    .filter((article): article is Article => Boolean(article));
}

export function storyCountForEdition(edition: Edition) {
  const ids = new Set<string>();
  for (const sectionId of edition.sectionIds) {
    const section = sectionById.get(sectionId);
    section?.articleIds.forEach((id) => ids.add(id));
  }
  return ids.size;
}

export function personalizeIntro(
  interests: string[],
  customInterests: string[],
) {
  const named = [...interests, ...customInterests];
  if (named.length === 0) {
    return "A sample morning paper. Complete onboarding to fold the edition around your interests.";
  }
  if (named.length === 1) {
    return `Prepared this morning with ${named[0].replace(/-/g, " ")} in mind.`;
  }
  const readable = named.slice(0, 3).map((item) => item.replace(/-/g, " "));
  return `Folded this morning around ${readable.join(", ")}.`;
}
