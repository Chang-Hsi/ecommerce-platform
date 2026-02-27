"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { ProductDetailContent } from "@/content/product-detail";
import type { ProductCatalogItem } from "@/content/products";
import { ProductDetailView } from "@/components/products/ProductDetailView";
import { fetchProductDetailBySlugFromApi } from "@/lib/api/products";
import { getProductDetailBySlug, getProductsBySlugs } from "@/lib/products/detail-mapper";

type ProductDetailPageProps = {
  slug?: string;
};

export function ProductDetailPage({ slug }: Readonly<ProductDetailPageProps>) {
  const params = useParams<{ slug?: string }>();
  const resolvedSlug = (slug ?? params?.slug ?? "").trim();
  const [detail, setDetail] = useState<ProductDetailContent | null>(null);
  const [recommendations, setRecommendations] = useState<ProductCatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadProductDetail() {
      if (!resolvedSlug) {
        setDetail(null);
        setRecommendations([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const payload = await fetchProductDetailBySlugFromApi(resolvedSlug);

        if (!isMounted) {
          return;
        }

        setDetail(payload.detail);
        setRecommendations(payload.recommendations);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("[ProductDetailPage] loadProductDetail failed", error);

        const fallbackDetail = getProductDetailBySlug(resolvedSlug);
        if (!fallbackDetail) {
          setDetail(null);
          setRecommendations([]);
          return;
        }

        setDetail(fallbackDetail);
        setRecommendations(getProductsBySlugs(fallbackDetail.recommendationSlugs));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProductDetail();

    return () => {
      isMounted = false;
    };
  }, [resolvedSlug]);

  if (isLoading && !detail) {
    return <div className="mx-auto w-full max-w-7xl px-4 py-10 text-base text-zinc-600">載入商品中...</div>;
  }

  if (!detail) {
    return <div className="mx-auto w-full max-w-7xl px-4 py-10 text-base text-zinc-600">找不到商品。</div>;
  }

  return <ProductDetailView detail={detail} recommendations={recommendations} />;
}
