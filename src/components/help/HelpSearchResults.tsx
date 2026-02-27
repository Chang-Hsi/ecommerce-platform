import Link from "next/link";
import type { HelpSearchResult } from "@/lib/help/types";

type HelpSearchResultsProps = {
  query: string;
  title: string;
  noResultTitle: string;
  noResultContactLabel: string;
  results: HelpSearchResult[];
};

export function HelpSearchResults({
  query,
  title,
  noResultTitle,
  noResultContactLabel,
  results,
}: Readonly<HelpSearchResultsProps>) {
  return (
    <section className="space-y-6 border-t border-zinc-300 pt-8">
      <h2 className="text-4xl font-semibold text-zinc-900 sm:text-3xl">{title}</h2>

      {results.length > 0 ? (
        <ul className="divide-y divide-zinc-200 border-y border-zinc-200">
          {results.map((result) => (
            <li key={`${result.type}-${result.id}`}>
              <Link href={result.href} className="block px-1 py-4 hover:bg-zinc-100">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{result.subtitle}</p>
                <p className="mt-1 text-lg font-medium text-zinc-900">{result.title}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="space-y-2 py-8 text-center">
          <p className="text-4xl font-semibold text-zinc-900 sm:text-3xl">{noResultTitle}</p>
          <Link href="/help/contact" className="inline-flex text-base font-medium text-zinc-900 underline">
            {noResultContactLabel}
          </Link>
          <p className="text-sm text-zinc-500">「{query}」</p>
        </div>
      )}
    </section>
  );
}
