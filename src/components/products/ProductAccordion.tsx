import { ChevronDownIcon, StarIcon } from "@heroicons/react/20/solid";
import type { ProductDetailAccordionItem } from "@/content/product-detail";

type ProductAccordionProps = {
  items: ProductDetailAccordionItem[];
  openKey: string | null;
  onToggle: (key: string) => void;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function RatingStars({ stars }: Readonly<{ stars: number }>) {
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`評分 ${stars} 星`}>
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon
          key={index}
          className={cn("h-4 w-4", index < stars ? "text-zinc-900" : "text-zinc-300")}
          aria-hidden
        />
      ))}
    </div>
  );
}

export function ProductAccordion({ items, openKey, onToggle }: Readonly<ProductAccordionProps>) {
  return (
    <section className="border-t border-zinc-200">
      {items.map((item) => {
        const isOpen = item.key === openKey;

        return (
          <div key={item.key} className="border-b border-zinc-200 py-4">
            <button
              type="button"
              onClick={() => onToggle(item.key)}
              className="flex w-full items-center justify-between gap-3 text-left"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl font-semibold text-zinc-900">{item.title}</span>
                {item.ratingStars ? <RatingStars stars={item.ratingStars} /> : null}
                {item.ratingCount ? <span className="text-sm text-zinc-600">({item.ratingCount})</span> : null}
              </div>
              <ChevronDownIcon className={cn("h-5 w-5 text-zinc-700 transition-transform", isOpen && "rotate-180")} aria-hidden />
            </button>

            <div
              className={cn(
                "motion-collapse",
                isOpen ? "motion-collapse-open" : "motion-collapse-closed",
              )}
            >
              <div className="overflow-hidden">
                <p className="pt-3 text-base leading-7 text-zinc-700">{item.content}</p>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
