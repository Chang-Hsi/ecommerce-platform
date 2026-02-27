import { type Prisma, ProductStatus } from "@prisma/client";
import type {
  ProductCatalogItem,
  ProductColorLabel,
  ProductFeatureOption,
  ProductFitOption,
  ProductGenderOption,
  ProductKidsOption,
  ProductPriceOption,
  ProductSportOption,
  ProductTechOption,
} from "@/content/products";
import type { ProductDetailAccordionItem, ProductDetailContent, ProductSizeOption } from "@/content/product-detail";
import { prisma } from "@/lib/prisma";

const PRODUCT_LIST_PAGE_SIZE = 24;

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    images: {
      orderBy: {
        sortOrder: "asc";
      };
    };
    variants: {
      orderBy: {
        createdAt: "asc";
      };
    };
  };
}>;

function decimalToNumber(value: Prisma.Decimal | null | undefined) {
  if (value === null || value === undefined) {
    return undefined;
  }

  return Number(value);
}

function resolveBadge(product: ProductWithRelations) {
  if (product.badgeLabel && product.badgeLabel.trim()) {
    return product.badgeLabel;
  }

  if (product.status === ProductStatus.UPCOMING) {
    return "即將推出";
  }

  return "新品";
}

function resolvePriceRange(value: number): ProductPriceOption {
  if (value < 1500) {
    return "低於 $1,500";
  }

  if (value < 3000) {
    return "$1,500 - $3,000";
  }

  if (value < 5000) {
    return "$3,000 - $5,000";
  }

  return "$5,000 以上";
}

function toGenderOptions(gender: ProductWithRelations["gender"]): ProductGenderOption[] {
  if (gender === "MEN") {
    return ["男子"];
  }

  if (gender === "WOMEN") {
    return ["女子"];
  }

  return ["中性"];
}

function toKidsSegments(audience: ProductWithRelations["audience"]): ProductKidsOption[] {
  if (audience === "KIDS") {
    return ["男童", "女童款"];
  }

  return [];
}

function toCatalogItem(product: ProductWithRelations): ProductCatalogItem {
  const firstImage = product.images[0];

  return {
    slug: product.slug,
    name: product.name,
    subtitle: product.subtitle,
    badge: resolveBadge(product),
    price: Number(product.basePrice),
    imageSrc: firstImage?.src ?? "",
    imageRatio: product.imageRatio === "portrait" ? "portrait" : "square",
    filterAttributes: {
      category: (product.category || "shoes") as ProductCatalogItem["filterAttributes"]["category"],
      gender: toGenderOptions(product.gender),
      audience: product.audience === "KIDS" ? "kids" : "adult",
      kidsSegments: toKidsSegments(product.audience),
      priceRange: resolvePriceRange(Number(product.basePrice)),
      colors: product.colorTags as ProductColorLabel[],
      brand: product.brand as ProductCatalogItem["filterAttributes"]["brand"],
      sports: product.sports as ProductSportOption[],
      fit: product.fitTags as ProductFitOption[],
      features: product.featureTags as ProductFeatureOption[],
      tech: product.techTags as ProductTechOption[],
    },
  };
}

function sortSizesAscending(a: ProductSizeOption, b: ProductSizeOption) {
  const aNumber = Number(a.value);
  const bNumber = Number(b.value);

  if (Number.isFinite(aNumber) && Number.isFinite(bNumber)) {
    return aNumber - bNumber;
  }

  return a.value.localeCompare(b.value);
}

function buildProductSizes(product: ProductWithRelations) {
  const bySize = new Map<string, ProductSizeOption>();

  for (const variant of product.variants) {
    const value = variant.sizeLabel;

    if (!value) {
      continue;
    }

    const existing = bySize.get(value);
    const isInStock = variant.stockQty > 0 && variant.isActive;

    if (!existing) {
      bySize.set(value, {
        label: `CM ${value}`,
        value,
        inStock: isInStock,
      });
      continue;
    }

    if (!existing.inStock && isInStock) {
      bySize.set(value, {
        ...existing,
        inStock: true,
      });
    }
  }

  return Array.from(bySize.values()).sort(sortSizesAscending);
}

function buildAccordions(): ProductDetailAccordionItem[] {
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

function toProductDetail(product: ProductWithRelations, recommendationSlugs: string[]): ProductDetailContent {
  const firstVariant = product.variants[0];
  const sizes = buildProductSizes(product);
  const compareAtPrice = decimalToNumber(firstVariant?.compareAtPrice ?? product.compareAtPrice);

  return {
    slug: product.slug,
    name: product.name,
    subtitle: product.subtitle,
    badge: resolveBadge(product),
    media: product.images.map((image, index) => ({
      id: `${product.slug}-media-${index + 1}`,
      imageSrc: image.src,
      alt: image.alt ?? `${product.name} 圖片 ${index + 1}`,
    })),
    pricing: {
      price: Number(firstVariant?.unitPrice ?? product.basePrice),
      compareAtPrice,
      discountPercent: compareAtPrice
        ? Math.round((1 - Number(firstVariant?.unitPrice ?? product.basePrice) / compareAtPrice) * 100)
        : undefined,
    },
    sizes,
    description:
      product.description
      || "無論訓練或日常穿搭，這款鞋款都兼顧穩定與舒適。透過鞋面支撐與中底回彈設計，提供長時間著用所需的腳感與控制力。",
    specs: {
      color: firstVariant?.colorLabel || product.colorTags.join("/") || "黑色",
      styleCode: product.slug.replace(/-/g, "").toUpperCase().slice(0, 8),
      origin: "越南",
    },
    accordions: buildAccordions(),
    recommendationSlugs,
  };
}

export type ProductsListInput = {
  category?: string | null;
  sort?: "popular" | "newest" | "price_desc" | "price_asc";
  page?: number;
  q?: string | null;
  gender?: string[];
  kids?: string[];
  price?: string[];
  brand?: string[];
  sport?: string[];
  fit?: string[];
  feature?: string[];
  tech?: string[];
  colors?: string[];
};

function mapGenderFilter(values: string[]) {
  const mapped = values.flatMap((value) => {
    if (value === "男子") {
      return ["MEN"] as const;
    }

    if (value === "女子") {
      return ["WOMEN"] as const;
    }

    if (value === "中性") {
      return ["UNISEX"] as const;
    }

    return [];
  });

  return mapped;
}

function mapSort(sort: ProductsListInput["sort"]): Prisma.ProductOrderByWithRelationInput[] {
  if (sort === "newest") {
    return [{ releaseAt: "desc" }, { createdAt: "desc" }];
  }

  if (sort === "price_desc") {
    return [{ basePrice: "desc" }, { createdAt: "desc" }];
  }

  if (sort === "price_asc") {
    return [{ basePrice: "asc" }, { createdAt: "desc" }];
  }

  return [{ isFeatured: "desc" }, { createdAt: "desc" }];
}

export async function listProductsFromDb(input: ProductsListInput) {
  const safePage = Math.max(1, Math.floor(input.page ?? 1));
  const skip = (safePage - 1) * PRODUCT_LIST_PAGE_SIZE;

  const where: Prisma.ProductWhereInput = {
    status: {
      in: [ProductStatus.ACTIVE, ProductStatus.UPCOMING],
    },
  };

  if (input.category) {
    where.category = input.category;
  }

  if (input.q && input.q.trim()) {
    const query = input.q.trim();
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { subtitle: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  if (input.brand && input.brand.length > 0) {
    where.brand = { in: input.brand };
  }

  const genderFilter = mapGenderFilter(input.gender ?? []);
  if (genderFilter.length > 0) {
    where.gender = { in: genderFilter };
  }

  if ((input.kids ?? []).length > 0) {
    where.audience = "KIDS";
  }

  if (input.sport && input.sport.length > 0) {
    where.sports = { hasSome: input.sport };
  }

  if (input.fit && input.fit.length > 0) {
    where.fitTags = { hasSome: input.fit };
  }

  if (input.feature && input.feature.length > 0) {
    where.featureTags = { hasSome: input.feature };
  }

  if (input.tech && input.tech.length > 0) {
    where.techTags = { hasSome: input.tech };
  }

  if (input.colors && input.colors.length > 0) {
    where.colorTags = { hasSome: input.colors };
  }

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: mapSort(input.sort),
      skip,
      take: PRODUCT_LIST_PAGE_SIZE,
      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
        variants: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    }),
  ]);

  return {
    products: products.map(toCatalogItem),
    pagination: {
      page: safePage,
      pageSize: PRODUCT_LIST_PAGE_SIZE,
      total,
      totalPages: Math.max(1, Math.ceil(total / PRODUCT_LIST_PAGE_SIZE)),
    },
  };
}

export async function getProductDetailBySlugFromDb(slug: string) {
  const product = await prisma.product.findFirst({
    where: {
      slug,
      status: {
        in: [ProductStatus.ACTIVE, ProductStatus.UPCOMING],
      },
    },
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
      variants: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  const recommendationProducts = await prisma.product.findMany({
    where: {
      status: {
        in: [ProductStatus.ACTIVE, ProductStatus.UPCOMING],
      },
      slug: {
        not: slug,
      },
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: 6,
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
      variants: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const recommendationSlugs = recommendationProducts.map((item) => item.slug);

  return {
    detail: toProductDetail(product, recommendationSlugs),
    recommendations: recommendationProducts.map(toCatalogItem),
  };
}
