import { productsContent, type ProductCatalogItem } from "@/content/products";

export type ProductMediaItem = {
  id: string;
  imageSrc: string;
  alt: string;
};

export type ProductDetailPricing = {
  price: number;
  compareAtPrice?: number;
  discountPercent?: number;
};

export type ProductSizeOption = {
  label: string;
  value: string;
  inStock: boolean;
  hint?: string;
};

export type ProductDetailSpecs = {
  color: string;
  styleCode: string;
  origin: string;
};

export type ProductDetailAccordionItem = {
  key: "shipping" | "reviews";
  title: string;
  content: string;
  ratingStars?: number;
  ratingCount?: number;
};

export type ProductDetailContent = {
  slug: string;
  name: string;
  subtitle: string;
  badge: string;
  media: ProductMediaItem[];
  pricing: ProductDetailPricing;
  sizes: ProductSizeOption[];
  description: string;
  specs: ProductDetailSpecs;
  accordions: ProductDetailAccordionItem[];
  recommendationSlugs: string[];
};

type ProductDetailOverride = {
  name?: string;
  subtitle?: string;
  badge?: string;
  media?: ProductMediaItem[];
  pricing?: Partial<ProductDetailPricing>;
  sizes?: ProductSizeOption[];
  description?: string;
  specs?: Partial<ProductDetailSpecs>;
  accordions?: ProductDetailAccordionItem[];
  recommendationSlugs?: string[];
};

const defaultSizes: ProductSizeOption[] = [
  { label: "CM 24", value: "24", inStock: false, hint: "US 6" },
  { label: "CM 24.5", value: "24.5", inStock: true },
  { label: "CM 25", value: "25", inStock: true },
  { label: "CM 25.5", value: "25.5", inStock: true },
  { label: "CM 26", value: "26", inStock: true },
  { label: "CM 26.5", value: "26.5", inStock: true },
  { label: "CM 27", value: "27", inStock: true },
  { label: "CM 27.5", value: "27.5", inStock: true },
  { label: "CM 28", value: "28", inStock: true },
  { label: "CM 28.5", value: "28.5", inStock: true },
  { label: "CM 29", value: "29", inStock: true },
  { label: "CM 29.5", value: "29.5", inStock: true },
  { label: "CM 30", value: "30", inStock: false },
  { label: "CM 30.5", value: "30.5", inStock: false },
  { label: "CM 31", value: "31", inStock: false },
];

const originPool = ["中國, 越南", "印尼, 越南", "越南"];

const extraMediaPool = [
  "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1579446650032-86f4f5d5d7d8?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=900&q=80",
];

const productDetailOverrides: Record<string, ProductDetailOverride> = {
  "air-max-95-og": {
    description:
      "無論在球場內外，這款鞋都以穩定包覆與快速反應為核心。搭配多向抓地與輕量鞋面設計，能支撐高速切入與急停轉向。",
    specs: {
      color: "多種顏色/Bright Crimson",
      styleCode: "HQ2330-900",
      origin: "中國, 越南",
    },
    pricing: {
      compareAtPrice: 10800,
      discountPercent: 10,
    },
    accordions: [
      {
        key: "shipping",
        title: "免費寄送及退貨",
        content: "會員享標準免運，七天內可申請退貨。偏遠地區配送時間依物流公告為準。",
      },
      {
        key: "reviews",
        title: "評價",
        content: "目前共有 1 則評價。整體回饋為包覆穩定、抓地力佳，適合比賽節奏較快的球員。",
        ratingStars: 5,
        ratingCount: 1,
      },
    ],
  },
  "zoom-fly-6": {
    pricing: {
      compareAtPrice: 5200,
      discountPercent: 17,
    },
    specs: {
      styleCode: "FV9123-600",
    },
  },
};

function createStyleCode(slug: string, index: number) {
  const normalized = slug.replace(/-/g, "").slice(0, 5).toUpperCase();
  return `${normalized}${(200 + index).toString()}-0${(index % 9) + 1}`;
}

function buildMedia(item: ProductCatalogItem): ProductMediaItem[] {
  const images = [item.imageSrc];

  for (const candidate of extraMediaPool) {
    if (images.length >= 10) {
      break;
    }

    if (!images.includes(candidate)) {
      images.push(candidate);
    }
  }

  return images.map((imageSrc, index) => ({
    id: `${item.slug}-media-${index + 1}`,
    imageSrc,
    alt: `${item.name} 圖片 ${index + 1}`,
  }));
}

function resolveRecommendationSlugs(currentSlug: string) {
  const orderedSlugs = productsContent.map((item) => item.slug);
  const currentIndex = orderedSlugs.indexOf(currentSlug);

  if (currentIndex === -1) {
    return orderedSlugs.slice(0, 6);
  }

  const rotated = [...orderedSlugs.slice(currentIndex + 1), ...orderedSlugs.slice(0, currentIndex)];
  return rotated.slice(0, 6);
}

function buildDefaultAccordions(): ProductDetailAccordionItem[] {
  return [
    {
      key: "shipping",
      title: "免費寄送及退貨",
      content: "一般會員訂單滿額免運，出貨後可於會員中心追蹤物流。商品保持完整可於時限內申請退貨。",
    },
    {
      key: "reviews",
      title: "評價",
      content: "目前共有 1 則精選評價，使用者回饋整體舒適度與包覆表現良好。",
      ratingStars: 5,
      ratingCount: 1,
    },
  ];
}

function mergeDetail(
  baseDetail: ProductDetailContent,
  override?: ProductDetailOverride,
): ProductDetailContent {
  if (!override) {
    return baseDetail;
  }

  return {
    ...baseDetail,
    ...override,
    pricing: {
      ...baseDetail.pricing,
      ...override.pricing,
    },
    specs: {
      ...baseDetail.specs,
      ...override.specs,
    },
    media: override.media ?? baseDetail.media,
    sizes: override.sizes ?? baseDetail.sizes,
    accordions: override.accordions ?? baseDetail.accordions,
    recommendationSlugs: override.recommendationSlugs ?? baseDetail.recommendationSlugs,
  };
}

function buildDefaultProductDetail(item: ProductCatalogItem, index: number): ProductDetailContent {
  const compareAtPrice = item.badge === "即將推出" ? Math.round(item.price * 1.1) : undefined;

  return {
    slug: item.slug,
    name: item.name,
    subtitle: item.subtitle,
    badge: item.badge,
    media: buildMedia(item),
    pricing: {
      price: item.price,
      compareAtPrice,
      discountPercent: compareAtPrice ? Math.round((1 - item.price / compareAtPrice) * 100) : undefined,
    },
    sizes: defaultSizes,
    description:
      "無論訓練或日常穿搭，這款鞋款都兼顧穩定與舒適。透過鞋面支撐與中底回彈設計，提供長時間著用所需的腳感與控制力。",
    specs: {
      color: item.filterAttributes.colors.join("/") || "黑色",
      styleCode: createStyleCode(item.slug, index),
      origin: originPool[index % originPool.length],
    },
    accordions: buildDefaultAccordions(),
    recommendationSlugs: resolveRecommendationSlugs(item.slug),
  };
}

const productDetailContentMap = new Map<string, ProductDetailContent>(
  productsContent.map((item, index) => {
    const defaultDetail = buildDefaultProductDetail(item, index);
    const detail = mergeDetail(defaultDetail, productDetailOverrides[item.slug]);
    return [item.slug, detail];
  }),
);

export function getProductDetailContent(slug: string) {
  return productDetailContentMap.get(slug) ?? null;
}
