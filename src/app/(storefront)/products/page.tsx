import { ProductsPage } from "@/features/products/ProductsPage";

type ProductsRoutePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsRoutePage({ searchParams }: ProductsRoutePageProps) {
  const resolvedSearchParams = await searchParams;
  return <ProductsPage searchParams={resolvedSearchParams} />;
}
