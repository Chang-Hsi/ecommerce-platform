import { FavoriteItemCard } from "@/components/favorites/FavoriteItemCard";
import type { FavoriteViewItem } from "@/hooks/favorites/useFavoritesController";

type FavoritesGridProps = {
  items: FavoriteViewItem[];
  onRemoveFavorite: (itemId: string) => void;
  onAddToCart: (item: FavoriteViewItem) => void;
};

export function FavoritesGrid({ items, onRemoveFavorite, onAddToCart }: Readonly<FavoritesGridProps>) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <FavoriteItemCard
          key={item.id}
          item={item}
          onRemoveFavorite={onRemoveFavorite}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
