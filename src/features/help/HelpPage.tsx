"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { helpContactMethods, helpFaqById, helpPageContent, helpTopics } from "@/content/help";
import { HelpContactSection } from "@/components/help/HelpContactSection";
import { HelpQuickLinksGrid } from "@/components/help/HelpQuickLinksGrid";
import { HelpSearchBar } from "@/components/help/HelpSearchBar";
import { HelpSearchResults } from "@/components/help/HelpSearchResults";
import { type HelpApiPayload, fetchHelpPageDataFromApi } from "@/lib/api/help";
import { searchHelp } from "@/lib/help/search";

export function HelpPage() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();
  const [apiPayload, setApiPayload] = useState<HelpApiPayload | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadHelpData() {
      try {
        const payload = await fetchHelpPageDataFromApi(query);

        if (!isMounted) {
          return;
        }

        setApiPayload(payload);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("[HelpPage] loadHelpData failed", error);
        setApiPayload(null);
      }
    }

    void loadHelpData();

    return () => {
      isMounted = false;
    };
  }, [query]);

  const fallbackQuickTopics = useMemo(
    () =>
      helpTopics.map((topic) => ({
        ...topic,
        featuredQuestions: topic.featuredQuestionIds
          .map((id) => helpFaqById[id])
          .filter(Boolean)
          .map((item) => ({ id: item.id, question: item.question })),
      })),
    [],
  );

  const fallbackHasQuery = query.length > 0;
  const hasQuery = apiPayload?.hasQuery ?? fallbackHasQuery;
  const quickTopics = apiPayload?.quickTopics ?? fallbackQuickTopics;
  const contactMethods = apiPayload?.contactMethods ?? helpContactMethods;
  const searchResults = apiPayload?.searchResults ?? (hasQuery ? searchHelp(query) : []);
  const pageContent = apiPayload?.pageContent ?? helpPageContent;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 mb-[5rem]">
      <header className="space-y-4 pt-2 text-center">
        <h1 className="text-5xl font-semibold text-zinc-900 sm:text-4xl">{pageContent.pageTitle}</h1>
        <HelpSearchBar placeholder={pageContent.searchPlaceholder} defaultQuery={query} />
      </header>

      {hasQuery ? (
        <HelpSearchResults
          query={query}
          title={`以下關鍵字的搜尋結果：「${query}」`}
          noResultTitle={pageContent.noSearchResultTitle}
          noResultContactLabel={pageContent.noSearchResultContactLabel}
          results={searchResults}
        />
      ) : (
        <>
          <section className="space-y-3 border-t border-zinc-300 pt-8">
            <h2 className="text-3xl font-semibold text-zinc-900 sm:text-2xl">{pageContent.quickHelpTitle}</h2>
            <p className="text-base text-zinc-600">{pageContent.quickHelpDescription}</p>
          </section>

          <HelpQuickLinksGrid topics={quickTopics} />
          <HelpContactSection title={pageContent.contactSectionTitle} methods={contactMethods} />
        </>
      )}
    </div>
  );
}
