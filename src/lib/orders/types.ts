export type OrderItemView = {
  id: string;
  slug: string | null;
  name: string;
  subtitle: string;
  imageSrc: string;
  colorLabel: string;
  sizeLabel: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
  compareAtPrice?: number;
};

export type OrderView = {
  id: string;
  status: string;
  paymentStatus: string;
  total: number;
  currency: string;
  deliveryWindowLabel: string;
  placedAt: string | null;
  items: OrderItemView[];
};
