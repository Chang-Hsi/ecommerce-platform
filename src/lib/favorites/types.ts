export type MockFavoriteItem = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  imageSrc: string;
  price: number;
  compareAtPrice?: number;
  colorLabel: string;
  defaultSize?: string;
  requiresSizeSelection: boolean;
  addedAt: string;
};

export type FavoritePanelOpenPayload = {
  itemId: string;
};

export type AddFavoriteItemInput = {
  slug: string;
  name: string;
  subtitle: string;
  imageSrc: string;
  price: number;
  compareAtPrice?: number;
  colorLabel: string;
  defaultSize?: string;
  requiresSizeSelection: boolean;
};

export type FavoriteToggleResult = {
  isFavorite: boolean;
  item: MockFavoriteItem | null;
};
