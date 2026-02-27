import {
  helpContactMethods,
  helpFaqById,
  helpPageContent,
  helpTopics,
} from "@/content/help";
import { searchHelp } from "@/lib/help/search";
import { apiOk } from "@/lib/server/api-response";

function mapQuickTopics() {
  return helpTopics.map((topic) => ({
    ...topic,
    featuredQuestions: topic.featuredQuestionIds
      .map((id) => helpFaqById[id])
      .filter(Boolean)
      .map((item) => ({ id: item.id, question: item.question })),
  }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim();
  const hasQuery = query.length > 0;

  return apiOk({
    pageContent: helpPageContent,
    query,
    hasQuery,
    quickTopics: hasQuery ? [] : mapQuickTopics(),
    contactMethods: hasQuery ? [] : helpContactMethods,
    searchResults: hasQuery ? searchHelp(query) : [],
  });
}
