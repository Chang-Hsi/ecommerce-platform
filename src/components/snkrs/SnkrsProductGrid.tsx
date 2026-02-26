import { SnkrsProductCard } from "@/components/snkrs/SnkrsProductCard";
import type { SnkrsProductItem } from "@/lib/snkrs/types";

type SnkrsProductGridProps = {
  items: SnkrsProductItem[];
  buyButtonLabel: string;
  upcomingButtonLabel: string;
};

export function SnkrsProductGrid({ items, buyButtonLabel, upcomingButtonLabel }: Readonly<SnkrsProductGridProps>) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      {items.map((item) => (
        <SnkrsProductCard
          key={item.id}
          item={item}
          buyButtonLabel={buyButtonLabel}
          upcomingButtonLabel={upcomingButtonLabel}
        />
      ))}
    </div>
  );
}
