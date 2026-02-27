import Link from "next/link";
import type { HelpTopic } from "@/lib/help/types";

type HelpQuickLinksGridProps = {
  topics: Array<
    HelpTopic & {
      featuredQuestions: Array<{ id: string; question: string }>;
    }
  >;
};

export function HelpQuickLinksGrid({ topics }: Readonly<HelpQuickLinksGridProps>) {
  return (
    <section className="space-y-6">
      <div className="grid gap-x-12 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic) => (
          <article key={topic.slug} className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-900">{topic.title}</h3>

            <ul className="space-y-2">
              {topic.featuredQuestions.map((item) => (
                <li key={item.id}>
                  <Link href={`/help/topics/${topic.slug}#${item.id}`} className="text-base text-zinc-800 hover:underline">
                    {item.question}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
