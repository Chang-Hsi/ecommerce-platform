import { HelpTopicPage } from "@/features/help/HelpTopicPage";

type HelpTopicRoutePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function HelpTopicRoutePage({ params }: HelpTopicRoutePageProps) {
  const resolvedParams = await params;
  return <HelpTopicPage topicSlug={resolvedParams.slug} />;
}
