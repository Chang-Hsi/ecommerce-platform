import type { MockCartItem } from "@/lib/cart/types";

export const cartMessages = {
  lowStock: "所剩庫存不多，欲購從速。",
  favoritesEmpty: "你的最愛中未儲存任何品項。",
  emptyCart: "你的購物車目前沒有商品。",
};

export const defaultMockCartItems: MockCartItem[] = [
  {
    id: "air-max-95-big-bubble-28",
    slug: "air-max-95-big-bubble",
    name: "SwooshLab Air Max 95 Big Bubble",
    subtitle: "天然偏硬草地低筒足球鞋",
    imageSrc: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80",
    colorLabel: "Metallic Red Bronze/Metallic Rose Gold",
    sizeLabel: "28",
    unitPrice: 8100,
    qty: 1,
    lowStock: true,
    isFavorite: false,
  },
  {
    id: "air-max-95-og-25",
    slug: "air-max-95-og",
    name: 'SwooshLab Phantom 6 High Elite "EA SPORTS FC"',
    subtitle: "天然偏硬草地足球釘鞋",
    imageSrc: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    colorLabel: "多種顏色/Bright Crimson",
    sizeLabel: "25",
    unitPrice: 9720,
    compareAtPrice: 10800,
    qty: 2,
    lowStock: true,
    isFavorite: false,
  },
];
