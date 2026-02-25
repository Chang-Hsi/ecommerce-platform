import type { ProductSizeOption } from "@/content/product-detail";

type SizeGridProps = {
  sizes: ProductSizeOption[];
  selectedSize: string | null;
  onSelectSize: (sizeValue: string) => void;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function SizeGrid({ sizes, selectedSize, onSelectSize }: Readonly<SizeGridProps>) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {sizes.map((size) => {
        const isActive = size.value === selectedSize;

        return (
          <button
            key={size.value}
            type="button"
            onClick={() => onSelectSize(size.value)}
            disabled={!size.inStock}
            className={cn(
              "h-11 rounded-md border text-sm transition",
              isActive ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-800",
              !size.inStock && "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400 line-through",
            )}
          >
            {size.label}
            {size.hint ? ` (${size.hint})` : ""}
          </button>
        );
      })}
    </div>
  );
}
