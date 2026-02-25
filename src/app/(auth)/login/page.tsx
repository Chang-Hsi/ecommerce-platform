import { LoginPage } from "@/features/auth/LoginPage";

type LoginRoutePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginRoutePage({ searchParams }: LoginRoutePageProps) {
  const resolvedSearchParams = await searchParams;
  return <LoginPage searchParams={resolvedSearchParams} />;
}
