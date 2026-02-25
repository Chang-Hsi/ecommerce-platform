import { LoginVerifyPage } from "@/features/auth/LoginVerifyPage";

type LoginVerifyRoutePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginVerifyRoutePage({ searchParams }: LoginVerifyRoutePageProps) {
  const resolvedSearchParams = await searchParams;
  return <LoginVerifyPage searchParams={resolvedSearchParams} />;
}
