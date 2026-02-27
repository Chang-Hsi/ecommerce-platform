import { HelpPage } from "@/features/help/HelpPage";

type HelpRoutePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HelpRoutePage({ searchParams }: HelpRoutePageProps) {
  const resolvedSearchParams = await searchParams;
  return <HelpPage searchParams={resolvedSearchParams} />;
}
