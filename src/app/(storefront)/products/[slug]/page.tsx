import { ProductDetailPage } from "@/features/products/ProductDetailPage";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailRoutePage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  return <ProductDetailPage slug={slug} />;
}
