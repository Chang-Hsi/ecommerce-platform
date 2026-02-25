import { getProductDetailContent } from "@/content/product-detail";
import { productsContent, type ProductCatalogItem } from "@/content/products";

export function getProductDetailBySlug(slug: string) {
  return getProductDetailContent(slug);
}

export function getProductsBySlugs(slugs: string[]): ProductCatalogItem[] {
  const productMap = new Map(productsContent.map((item) => [item.slug, item]));

  return slugs.flatMap((slug) => {
    const product = productMap.get(slug);
    return product ? [product] : [];
  });
}
