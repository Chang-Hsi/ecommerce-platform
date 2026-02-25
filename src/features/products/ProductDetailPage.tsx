import { notFound } from "next/navigation";
import { ProductDetailView } from "@/components/products/ProductDetailView";
import { getProductDetailBySlug, getProductsBySlugs } from "@/lib/products/detail-mapper";

type ProductDetailPageProps = {
  slug: string;
};

export function ProductDetailPage({ slug }: Readonly<ProductDetailPageProps>) {
  const detail = getProductDetailBySlug(slug);

  if (!detail) {
    notFound();
  }

  const recommendations = getProductsBySlugs(detail.recommendationSlugs);

  return <ProductDetailView detail={detail} recommendations={recommendations} />;
}
