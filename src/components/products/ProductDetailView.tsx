"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ProductAccordion } from "@/components/products/ProductAccordion";
import { ProductMediaGallery } from "@/components/products/ProductMediaGallery";
import { ProductPurchasePanel } from "@/components/products/ProductPurchasePanel";
import { ProductRecommendations } from "@/components/products/ProductRecommendations";
import { ProductSpecs } from "@/components/products/ProductSpecs";
import type { ProductDetailContent } from "@/content/product-detail";
import type { ProductCatalogItem } from "@/content/products";
import { resolveSafeRedirect } from "@/lib/auth/mock-auth";
import { addCartItem } from "@/lib/cart/mock-cart";
import {
  isFavoriteItemBySlug,
  MOCK_FAVORITES_CHANGED_EVENT,
  toggleFavoriteItem,
} from "@/lib/favorites/mock-favorites";
import { useMockAuthSession } from "@/hooks/auth/useMockAuthSession";
import { useProductDetailController } from "@/hooks/products/useProductDetailController";

type ProductDetailViewProps = {
  detail: ProductDetailContent;
  recommendations: ProductCatalogItem[];
};

export function ProductDetailView({ detail, recommendations }: Readonly<ProductDetailViewProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useMockAuthSession();
  const [isFavorite, setIsFavorite] = useState(() => isFavoriteItemBySlug(detail.slug));

  const {
    activeMediaIndex,
    canGoPrevMedia,
    canGoNextMedia,
    selectedSize,
    sizeError,
    openAccordionKey,
    selectMedia,
    goPrevMedia,
    goNextMedia,
    selectSize,
    ensureSizeSelected,
    toggleAccordion,
  } = useProductDetailController({
    mediaCount: detail.media.length,
  });

  useEffect(() => {
    function syncFavoriteState() {
      setIsFavorite(isFavoriteItemBySlug(detail.slug));
    }

    syncFavoriteState();

    window.addEventListener("storage", syncFavoriteState);
    window.addEventListener(MOCK_FAVORITES_CHANGED_EVENT, syncFavoriteState as EventListener);

    return () => {
      window.removeEventListener("storage", syncFavoriteState);
      window.removeEventListener(MOCK_FAVORITES_CHANGED_EVENT, syncFavoriteState as EventListener);
    };
  }, [detail.slug]);

  function handleAddToCart() {
    const selected = ensureSizeSelected();
    if (!selected) {
      return;
    }

    if (!isAuthenticated) {
      const safeRedirect = resolveSafeRedirect(pathname || `/products/${detail.slug}`);
      router.push(`/login?redirect=${encodeURIComponent(safeRedirect)}`);
      return;
    }

    addCartItem({
      slug: detail.slug,
      name: detail.name,
      subtitle: detail.subtitle,
      imageSrc: detail.media[activeMediaIndex]?.imageSrc ?? detail.media[0]?.imageSrc ?? "",
      colorLabel: detail.specs.color,
      sizeLabel: selected,
      unitPrice: detail.pricing.price,
      compareAtPrice: detail.pricing.compareAtPrice,
      lowStock: true,
    });
  }

  function handleToggleFavorite() {
    if (!isAuthenticated) {
      const safeRedirect = resolveSafeRedirect(pathname || `/products/${detail.slug}`);
      router.push(`/login?redirect=${encodeURIComponent(safeRedirect)}`);
      return;
    }

    const activeImageSrc = detail.media[activeMediaIndex]?.imageSrc ?? detail.media[0]?.imageSrc ?? "";
    const result = toggleFavoriteItem({
      slug: detail.slug,
      name: detail.name,
      subtitle: detail.subtitle,
      imageSrc: activeImageSrc,
      price: detail.pricing.price,
      compareAtPrice: detail.pricing.compareAtPrice,
      colorLabel: detail.specs.color,
      defaultSize: selectedSize ?? undefined,
      requiresSizeSelection: detail.sizes.some((size) => size.inStock),
    });

    setIsFavorite(result.isFavorite);
  }

  return (
    <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-zinc-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-10">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
          <ProductMediaGallery
            media={detail.media}
            activeMediaIndex={activeMediaIndex}
            canGoPrevMedia={canGoPrevMedia}
            canGoNextMedia={canGoNextMedia}
            onSelectMedia={selectMedia}
            onGoPrevMedia={goPrevMedia}
            onGoNextMedia={goNextMedia}
          />

          <div className="space-y-5">
            <ProductPurchasePanel
              detail={detail}
              selectedSize={selectedSize}
              sizeError={sizeError}
              isFavorite={isFavorite}
              onSelectSize={selectSize}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
            />

            <ProductSpecs description={detail.description} specs={detail.specs} />

            <ProductAccordion items={detail.accordions} openKey={openAccordionKey} onToggle={toggleAccordion} />
          </div>
        </div>

        <ProductRecommendations items={recommendations} />
      </div>
    </div>
  );
}
