export type MockCartItem = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  imageSrc: string;
  colorLabel: string;
  sizeLabel: string;
  unitPrice: number;
  compareAtPrice?: number;
  qty: number;
  lowStock?: boolean;
  isFavorite?: boolean;
};

export type CartSummary = {
  subtotal: number;
  shippingFee: number;
  serviceFee: number;
  total: number;
};

export type MiniCartOpenPayload = {
  itemId: string;
};
