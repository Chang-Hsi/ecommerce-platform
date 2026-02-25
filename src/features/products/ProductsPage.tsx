import { ProductsView } from "@/components/products/ProductsView";

type ProductsPageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export function ProductsPage({ searchParams }: Readonly<ProductsPageProps>) {
  return <ProductsView searchParams={searchParams} />;
}
