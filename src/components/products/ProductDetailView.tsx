"use client";

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

  const {
    activeMediaIndex,
    canGoPrevMedia,
    canGoNextMedia,
    selectedSize,
    sizeError,
    isFavorite,
    openAccordionKey,
    selectMedia,
    goPrevMedia,
    goNextMedia,
    selectSize,
    ensureSizeSelected,
    toggleFavorite,
    toggleAccordion,
  } = useProductDetailController({
    mediaCount: detail.media.length,
  });

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
              onToggleFavorite={toggleFavorite}
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
