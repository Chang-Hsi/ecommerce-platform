import { CartStatus, ProductStatus, type Prisma } from "@prisma/client";
import type { MockCartItem } from "@/lib/cart/types";
import type { MockFavoriteItem } from "@/lib/favorites/types";
import { prisma } from "@/lib/prisma";

type ActiveCartWithItems = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        product: {
          include: {
            images: {
              orderBy: {
                sortOrder: "asc";
              };
            };
          };
        };
        variant: true;
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

function buildCartItemKey(slug: string, sizeLabel: string) {
  return `${slug}-${sizeLabel}`;
}

export function parseCartItemKey(itemKey: string) {
  const separatorIndex = itemKey.lastIndexOf("-");
  if (separatorIndex <= 0 || separatorIndex >= itemKey.length - 1) {
    return null;
  }

  return {
    slug: itemKey.slice(0, separatorIndex),
    sizeLabel: itemKey.slice(separatorIndex + 1),
  };
}

function mapCartItem(item: ActiveCartWithItems["items"][number]): MockCartItem {
  const slug = item.product.slug;
  const sizeLabel = item.variant.sizeLabel;

  return {
    id: buildCartItemKey(slug, sizeLabel),
    slug,
    name: item.product.name,
    subtitle: item.product.subtitle,
    imageSrc: item.product.images[0]?.src ?? "",
    colorLabel: item.variant.colorLabel,
    sizeLabel,
    unitPrice: Number(item.unitPrice),
    compareAtPrice: decimalToNumber(item.compareAtPrice),
    qty: item.qty,
    lowStock: item.variant.stockQty <= 3,
    isFavorite: false,
  };
}

export async function getOrCreateActiveCart(userId: string) {
  const existing = await prisma.cart.findFirst({
    where: {
      userId,
      status: CartStatus.ACTIVE,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.cart.create({
    data: {
      userId,
      status: CartStatus.ACTIVE,
      currency: "TWD",
      shippingFee: 0,
      serviceFee: 0,
      promoDiscount: 0,
    },
  });
}

export async function listCartItemsByUser(userId: string) {
  const cart = await getOrCreateActiveCart(userId);

  const withItems = await prisma.cart.findUnique({
    where: {
      id: cart.id,
    },
    include: {
      items: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          product: {
            include: {
              images: {
                orderBy: {
                  sortOrder: "asc",
                },
              },
            },
          },
          variant: true,
        },
      },
    },
  });

  if (!withItems) {
    return [];
  }

  return withItems.items.map(mapCartItem);
}

type UpsertCartItemInput = {
  userId: string;
  slug: string;
  sizeLabel?: string | null;
  qty?: number;
};

export async function upsertCartItemByUser(input: UpsertCartItemInput) {
  const cart = await getOrCreateActiveCart(input.userId);

  const product = await prisma.product.findFirst({
    where: {
      slug: input.slug,
      status: {
        in: [ProductStatus.ACTIVE, ProductStatus.UPCOMING],
      },
    },
    include: {
      variants: {
        where: {
          isActive: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!product) {
    throw new Error("找不到商品");
  }

  const selectedVariant = input.sizeLabel
    ? product.variants.find((item) => item.sizeLabel === input.sizeLabel)
    : product.variants[0];

  if (!selectedVariant) {
    throw new Error("找不到可加入購物車的尺寸");
  }

  const existing = await prisma.cartItem.findUnique({
    where: {
      cartId_variantId: {
        cartId: cart.id,
        variantId: selectedVariant.id,
      },
    },
  });

  const qtyDelta = Math.max(1, Math.floor(input.qty ?? 1));

  if (existing) {
    await prisma.cartItem.update({
      where: {
        id: existing.id,
      },
      data: {
        qty: existing.qty + qtyDelta,
        unitPrice: selectedVariant.unitPrice,
        compareAtPrice: selectedVariant.compareAtPrice,
      },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: product.id,
        variantId: selectedVariant.id,
        qty: qtyDelta,
        unitPrice: selectedVariant.unitPrice,
        compareAtPrice: selectedVariant.compareAtPrice,
      },
    });
  }

  return listCartItemsByUser(input.userId);
}

type UpdateCartItemQtyInput = {
  userId: string;
  itemKey: string;
  qty: number;
};

export async function updateCartItemQtyByUser(input: UpdateCartItemQtyInput) {
  const parsed = parseCartItemKey(input.itemKey);
  if (!parsed) {
    throw new Error("無效的購物車品項識別碼");
  }

  const cart = await getOrCreateActiveCart(input.userId);
  const product = await prisma.product.findUnique({
    where: {
      slug: parsed.slug,
    },
    include: {
      variants: true,
    },
  });

  if (!product) {
    throw new Error("找不到商品");
  }

  const variant = product.variants.find((item) => item.sizeLabel === parsed.sizeLabel);

  if (!variant) {
    throw new Error("找不到商品尺寸");
  }

  await prisma.cartItem.updateMany({
    where: {
      cartId: cart.id,
      variantId: variant.id,
    },
    data: {
      qty: Math.max(1, Math.floor(input.qty)),
      unitPrice: variant.unitPrice,
      compareAtPrice: variant.compareAtPrice,
    },
  });

  return listCartItemsByUser(input.userId);
}

type RemoveCartItemInput = {
  userId: string;
  itemKey: string;
};

export async function removeCartItemByUser(input: RemoveCartItemInput) {
  const parsed = parseCartItemKey(input.itemKey);
  if (!parsed) {
    throw new Error("無效的購物車品項識別碼");
  }

  const cart = await getOrCreateActiveCart(input.userId);
  const product = await prisma.product.findUnique({
    where: {
      slug: parsed.slug,
    },
    include: {
      variants: true,
    },
  });

  if (!product) {
    return listCartItemsByUser(input.userId);
  }

  const variant = product.variants.find((item) => item.sizeLabel === parsed.sizeLabel);
  if (!variant) {
    return listCartItemsByUser(input.userId);
  }

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
      variantId: variant.id,
    },
  });

  return listCartItemsByUser(input.userId);
}

function mapFavoriteItem(favorite: Prisma.FavoriteGetPayload<{
  include: {
    product: {
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
    };
  };
}>): MockFavoriteItem {
  const firstVariant = favorite.product.variants[0];

  return {
    id: favorite.product.slug,
    slug: favorite.product.slug,
    name: favorite.product.name,
    subtitle: favorite.product.subtitle,
    imageSrc: favorite.product.images[0]?.src ?? "",
    price: Number(firstVariant?.unitPrice ?? favorite.product.basePrice),
    compareAtPrice: decimalToNumber(firstVariant?.compareAtPrice ?? favorite.product.compareAtPrice),
    colorLabel: firstVariant?.colorLabel || favorite.product.colorTags.join("/") || "黑色",
    defaultSize: firstVariant?.sizeLabel,
    requiresSizeSelection: favorite.product.variants.length > 0,
    addedAt: favorite.createdAt.toISOString(),
  };
}

export async function listFavoriteItemsByUser(userId: string) {
  const favorites = await prisma.favorite.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      product: {
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
      },
    },
  });

  return favorites.map(mapFavoriteItem);
}

type UpsertFavoriteInput = {
  userId: string;
  slug: string;
};

export async function upsertFavoriteByUser(input: UpsertFavoriteInput) {
  const product = await prisma.product.findUnique({
    where: {
      slug: input.slug,
    },
  });

  if (!product) {
    throw new Error("找不到商品");
  }

  await prisma.favorite.upsert({
    where: {
      userId_productId: {
        userId: input.userId,
        productId: product.id,
      },
    },
    update: {},
    create: {
      userId: input.userId,
      productId: product.id,
    },
  });

  return listFavoriteItemsByUser(input.userId);
}

type RemoveFavoriteInput = {
  userId: string;
  slug: string;
};

export async function removeFavoriteByUser(input: RemoveFavoriteInput) {
  const product = await prisma.product.findUnique({
    where: {
      slug: input.slug,
    },
    select: {
      id: true,
    },
  });

  if (!product) {
    return listFavoriteItemsByUser(input.userId);
  }

  await prisma.favorite.deleteMany({
    where: {
      userId: input.userId,
      productId: product.id,
    },
  });

  return listFavoriteItemsByUser(input.userId);
}
