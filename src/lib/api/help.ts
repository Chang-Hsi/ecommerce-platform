import type { HelpContactMethod, HelpSearchResult, HelpTopic } from "@/lib/help/types";
import { request } from "@/lib/api/request";

export type HelpQuickTopicItem = HelpTopic & {
  featuredQuestions: Array<{ id: string; question: string }>;
};

export type HelpPageContentDto = {
  pageTitle: string;
  searchPlaceholder: string;
  quickHelpTitle: string;
  quickHelpDescription: string;
  noSearchResultTitle: string;
  noSearchResultContactLabel: string;
  contactSectionTitle: string;
  faqSectionTitle: string;
};

export type HelpApiPayload = {
  pageContent: HelpPageContentDto;
  query: string;
  hasQuery: boolean;
  quickTopics: HelpQuickTopicItem[];
  contactMethods: HelpContactMethod[];
  searchResults: HelpSearchResult[];
};

export async function fetchHelpPageDataFromApi(query: string) {
  const params = new URLSearchParams();
  if (query.trim()) {
    params.set("q", query.trim());
  }

  const path = params.toString() ? `/api/help?${params.toString()}` : "/api/help";

  const payload = await request<HelpApiPayload>(path, {
    cache: "no-store",
  });

  return payload.data;
}
