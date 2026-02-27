import { notFound } from "next/navigation";
import { helpArticlesBySlug, helpFaqById, helpPageContent } from "@/content/help";
import { HelpFaqAccordion } from "@/components/help/HelpFaqAccordion";
import type { HelpTopicSlug } from "@/lib/help/types";

type HelpTopicPageProps = {
  topicSlug: string;
};

export function HelpTopicPage({ topicSlug }: Readonly<HelpTopicPageProps>) {
  const article = helpArticlesBySlug[topicSlug as HelpTopicSlug];

  if (!article) {
    notFound();
  }

  const faqItems = article.faqIds
    .map((faqId) => helpFaqById[faqId])
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div className="mx-auto w-full max-w-5xl space-y-12 mb-[5rem]">
      <section className="space-y-8">
        <h1 className="text-5xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">{article.title}</h1>

        <div className="space-y-7 text-base leading-8 text-zinc-800">
          {article.introParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="space-y-2 text-base text-zinc-800">
          {article.highlightParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <HelpFaqAccordion title={helpPageContent.faqSectionTitle} items={faqItems} />
    </div>
  );
}
