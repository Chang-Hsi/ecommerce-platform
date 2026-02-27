import { helpArticles, helpFaqItems, helpTopics } from "@/content/help";
import type { HelpSearchResult } from "@/lib/help/types";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function includesQuery(haystack: string, query: string) {
  return normalize(haystack).includes(query);
}

function includesFromList(values: string[], query: string) {
  return values.some((value) => includesQuery(value, query));
}

export function searchHelp(rawQuery: string): HelpSearchResult[] {
  const query = normalize(rawQuery);
  if (!query) {
    return [];
  }

  const results: Array<HelpSearchResult & { score: number; order: number }> = [];
  const dedupe = new Set<string>();
  const topicsBySlug = new Map(helpTopics.map((topic) => [topic.slug, topic]));

  for (const faq of helpFaqItems) {
    const score =
      (includesQuery(faq.question, query) ? 3 : 0) +
      (includesQuery(faq.answer, query) ? 2 : 0) +
      (includesFromList(faq.keywords, query) ? 2 : 0);

    if (score === 0) {
      continue;
    }

    const key = `faq:${faq.id}`;
    if (dedupe.has(key)) {
      continue;
    }

    dedupe.add(key);
    results.push({
      id: faq.id,
      title: faq.question,
      subtitle: "常見問題",
      href: `/help/topics/${faq.topicSlug}#${faq.id}`,
      type: "faq",
      score,
      order: faq.sortOrder,
    });
  }

  for (const article of helpArticles) {
    const topic = topicsBySlug.get(article.slug);
    const topicTitle = topic?.title ?? "協助文章";
    const score =
      (includesQuery(article.title, query) ? 3 : 0) +
      (includesQuery(article.summary, query) ? 2 : 0) +
      (includesFromList(article.keywords, query) ? 2 : 0) +
      (includesQuery(topicTitle, query) ? 2 : 0) +
      (includesFromList(topic?.keywords ?? [], query) ? 1 : 0);

    if (score === 0) {
      continue;
    }

    const key = `article:${article.slug}`;
    if (!dedupe.has(key)) {
      dedupe.add(key);
      results.push({
        id: article.slug,
        title: article.title,
        subtitle: topicTitle,
        href: `/help/topics/${article.slug}`,
        type: "article",
        score,
        order: article.sortOrder,
      });
    }
  }

  return results
    .sort((left, right) => right.score - left.score || left.order - right.order)
    .map((result) => ({
      id: result.id,
      title: result.title,
      subtitle: result.subtitle,
      href: result.href,
      type: result.type,
    }));
}
