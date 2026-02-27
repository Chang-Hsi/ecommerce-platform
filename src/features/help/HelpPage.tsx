import { helpContactMethods, helpFaqById, helpPageContent, helpTopics } from "@/content/help";
import { HelpContactSection } from "@/components/help/HelpContactSection";
import { HelpQuickLinksGrid } from "@/components/help/HelpQuickLinksGrid";
import { HelpSearchBar } from "@/components/help/HelpSearchBar";
import { HelpSearchResults } from "@/components/help/HelpSearchResults";
import { searchHelp } from "@/lib/help/search";

type HelpPageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

function readSearchQuery(searchParams: Record<string, string | string[] | undefined>) {
  const value = searchParams.q;
  if (typeof value === "string") {
    return value.trim();
  }
  if (Array.isArray(value) && value.length > 0) {
    return value[0]?.trim() ?? "";
  }
  return "";
}

export function HelpPage({ searchParams }: Readonly<HelpPageProps>) {
  const query = readSearchQuery(searchParams);
  const hasQuery = query.length > 0;

  const quickTopics = helpTopics.map((topic) => ({
    ...topic,
    featuredQuestions: topic.featuredQuestionIds
      .map((id) => helpFaqById[id])
      .filter(Boolean)
      .map((item) => ({ id: item.id, question: item.question })),
  }));

  const searchResults = hasQuery ? searchHelp(query) : [];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 mb-[5rem]">
      <header className="space-y-4 pt-2 text-center">
        <h1 className="text-5xl font-semibold text-zinc-900 sm:text-4xl">{helpPageContent.pageTitle}</h1>
        <HelpSearchBar placeholder={helpPageContent.searchPlaceholder} defaultQuery={query} />
      </header>

      {hasQuery ? (
        <HelpSearchResults
          query={query}
          title={helpPageContent.searchResultsTitle(query)}
          noResultTitle={helpPageContent.noSearchResultTitle}
          noResultContactLabel={helpPageContent.noSearchResultContactLabel}
          results={searchResults}
        />
      ) : (
        <>
          <section className="space-y-3 border-t border-zinc-300 pt-8">
            <h2 className="text-3xl font-semibold text-zinc-900 sm:text-2xl">{helpPageContent.quickHelpTitle}</h2>
            <p className="text-base text-zinc-600">{helpPageContent.quickHelpDescription}</p>
          </section>

          <HelpQuickLinksGrid topics={quickTopics} />
          <HelpContactSection title={helpPageContent.contactSectionTitle} methods={helpContactMethods} />
        </>
      )}
    </div>
  );
}
