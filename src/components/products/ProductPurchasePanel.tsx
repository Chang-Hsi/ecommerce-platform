import { HeartIcon, ScaleIcon } from "@heroicons/react/24/outline";
import type { ProductDetailContent } from "@/content/product-detail";
import { SizeGrid } from "@/components/products/SizeGrid";

type ProductPurchasePanelProps = {
  detail: ProductDetailContent;
  selectedSize: string | null;
  sizeError: string | null;
  isFavorite: boolean;
  onSelectSize: (sizeValue: string) => void;
  onAddToCart: () => void;
  onToggleFavorite: () => void;
};

export function ProductPurchasePanel({
  detail,
  selectedSize,
  sizeError,
  isFavorite,
  onSelectSize,
  onAddToCart,
  onToggleFavorite,
}: Readonly<ProductPurchasePanelProps>) {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">{detail.name}</h1>
        <p className="mt-1 text-base text-zinc-600">{detail.subtitle}</p>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-base">
          <p className="font-medium text-zinc-900">NT${detail.pricing.price.toLocaleString()}</p>
          {detail.pricing.compareAtPrice ? (
            <p className="text-zinc-500 line-through">NT${detail.pricing.compareAtPrice.toLocaleString()}</p>
          ) : null}
          {detail.pricing.discountPercent ? (
            <p className="font-medium text-emerald-700">{detail.pricing.discountPercent}% 折扣</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-zinc-900">選取尺寸</h2>
          <button type="button" className="inline-flex items-center gap-1.5 text-sm text-zinc-700 hover:text-zinc-900">
            <ScaleIcon className="h-4 w-4" aria-hidden />
            尺寸指南
          </button>
        </div>

        <SizeGrid sizes={detail.sizes} selectedSize={selectedSize} onSelectSize={onSelectSize} />
        {sizeError ? <p className="text-sm text-red-600">{sizeError}</p> : null}
      </div>

      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={onAddToCart}
          className="h-12 w-full rounded-full bg-zinc-950 text-base font-semibold text-white hover:bg-black"
        >
          加入購物車
        </button>

        <button
          type="button"
          onClick={onToggleFavorite}
          className="inline-flex h-12 w-full items-center justify-center gap-1 rounded-full border border-zinc-300 bg-white text-base font-semibold text-zinc-900"
          aria-pressed={isFavorite}
        >
          <span>{isFavorite ? "已加入最愛" : "最愛"}</span>
          <HeartIcon className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </section>
  );
}
