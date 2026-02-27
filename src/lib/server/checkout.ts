import {
  CartStatus,
  DiscountType,
  PaymentMethod,
  PaymentStatus,
  type Prisma,
} from "@prisma/client";
import { buildCheckoutSummary } from "@/lib/checkout/pricing";
import type {
  CheckoutFormState,
  CheckoutOrderItem,
  CheckoutPaymentMethod,
  CheckoutPromo,
  CheckoutSummary,
} from "@/lib/checkout/types";
import { prisma } from "@/lib/prisma";
import { getOrCreateActiveCart } from "@/lib/server/cart-favorites";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_DELIVERY_WINDOW_LABEL = "在 3月4日 週三至 3月9日 週一之間送達";

type CheckoutPreviewPayload = {
  form: CheckoutFormState;
  items: CheckoutOrderItem[];
  summary: CheckoutSummary;
  appliedPromo: CheckoutPromo | null;
  deliveryWindowLabel: string;
};

type PlaceOrderInput = {
  userId: string;
  form: CheckoutFormState;
  paymentMethod: CheckoutPaymentMethod;
};

function decimalToNumber(value: Prisma.Decimal | null | undefined) {
  if (value === null || value === undefined) {
    return 0;
  }

  return Number(value);
}

function mapPaymentMethod(value: CheckoutPaymentMethod) {
  if (value === "paypal") {
    return PaymentMethod.PAYPAL;
  }

  if (value === "gpay") {
    return PaymentMethod.GPAY;
  }

  return PaymentMethod.CARD;
}

function mapCheckoutItem(item: Prisma.CartItemGetPayload<{
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
}>): CheckoutOrderItem {
  return {
    id: item.id,
    name: item.product.name,
    subtitle: item.product.subtitle,
    imageSrc: item.product.images[0]?.src ?? "",
    qty: item.qty,
    sizeLabel: item.variant.sizeLabel,
    unitPrice: Number(item.unitPrice),
    compareAtPrice: item.compareAtPrice ? Number(item.compareAtPrice) : undefined,
  };
}

function buildAddressQuery(address: {
  country: string;
  city: string;
  district: string;
  addressLine1: string;
  postalCode: string;
}) {
  return `${address.country} ${address.city} ${address.district} ${address.addressLine1} ${address.postalCode}`.trim();
}

function createFormDefaults(user: { email: string }, defaultAddress: {
  recipientLastName: string;
  recipientFirstName: string;
  phone: string;
  country: string;
  city: string;
  district: string;
  addressLine1: string;
  postalCode: string;
} | null): CheckoutFormState {
  return {
    email: user.email,
    firstName: defaultAddress?.recipientFirstName ?? "",
    lastName: defaultAddress?.recipientLastName ?? "",
    addressQuery: defaultAddress ? buildAddressQuery(defaultAddress) : "",
    phone: defaultAddress?.phone ?? "",
    billingSameAsShipping: true,
    billingFirstName: "",
    billingLastName: "",
    billingAddress: "",
    billingPhone: "",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    saveCardForFuture: false,
    setAsDefaultCard: false,
  };
}

function resolvePromoDiscountFromCode(
  promoCode: Prisma.PromoCodeGetPayload<Record<string, never>>,
  subtotal: number,
) {
  if (promoCode.discountType === DiscountType.PERCENT) {
    const percentValue = decimalToNumber(promoCode.discountValue);
    return Math.floor((subtotal * percentValue) / 100);
  }

  return Math.floor(decimalToNumber(promoCode.discountValue));
}

function isPromoCodeActive(promoCode: Prisma.PromoCodeGetPayload<Record<string, never>>) {
  if (!promoCode.isActive) {
    return false;
  }

  const now = new Date();

  if (promoCode.startsAt && promoCode.startsAt > now) {
    return false;
  }

  if (promoCode.endsAt && promoCode.endsAt < now) {
    return false;
  }

  if (promoCode.usageLimit !== null && promoCode.usageLimit !== undefined && promoCode.usedCount >= promoCode.usageLimit) {
    return false;
  }

  return true;
}

async function findCheckoutContext(userId: string) {
  const cart = await getOrCreateActiveCart(userId);

  const [user, activeCart, defaultAddress] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
      },
    }),
    prisma.cart.findUnique({
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
    }),
    prisma.userAddress.findFirst({
      where: {
        userId,
      },
      orderBy: [
        {
          isDefault: "desc",
        },
        {
          updatedAt: "desc",
        },
      ],
      select: {
        recipientLastName: true,
        recipientFirstName: true,
        phone: true,
        country: true,
        city: true,
        district: true,
        addressLine1: true,
        postalCode: true,
      },
    }),
  ]);

  if (!user || !activeCart) {
    throw new Error("找不到結帳資料");
  }

  const items = activeCart.items.map(mapCheckoutItem);
  const promoDiscount = decimalToNumber(activeCart.promoDiscount);
  const summary = buildCheckoutSummary(items, promoDiscount);
  const appliedPromo = activeCart.promoCode
    ? {
        code: activeCart.promoCode,
        discountAmount: promoDiscount,
      }
    : null;

  return {
    user,
    cart: activeCart,
    defaultAddress,
    items,
    summary,
    appliedPromo,
  };
}

export async function getCheckoutPreviewByUserId(userId: string): Promise<CheckoutPreviewPayload> {
  const context = await findCheckoutContext(userId);

  return {
    form: createFormDefaults(context.user, context.defaultAddress),
    items: context.items,
    summary: context.summary,
    appliedPromo: context.appliedPromo,
    deliveryWindowLabel: DEFAULT_DELIVERY_WINDOW_LABEL,
  };
}

export async function applyPromoCodeByUserId(userId: string, rawCode: string): Promise<CheckoutPreviewPayload> {
  const context = await findCheckoutContext(userId);
  const normalizedCode = rawCode.trim().toUpperCase();

  if (!normalizedCode) {
    await prisma.cart.update({
      where: {
        id: context.cart.id,
      },
      data: {
        promoCode: null,
        promoDiscount: 0,
      },
    });

    return getCheckoutPreviewByUserId(userId);
  }

  const promoCode = await prisma.promoCode.findUnique({
    where: {
      code: normalizedCode,
    },
  });

  if (!promoCode || !isPromoCodeActive(promoCode)) {
    throw new Error("促銷碼無效，請重新輸入。");
  }

  const baseSummary = buildCheckoutSummary(context.items, 0);
  const discountAmount = Math.max(
    0,
    Math.min(baseSummary.subtotal, resolvePromoDiscountFromCode(promoCode, baseSummary.subtotal)),
  );

  await prisma.cart.update({
    where: {
      id: context.cart.id,
    },
    data: {
      promoCode: normalizedCode,
      promoDiscount: discountAmount,
    },
  });

  return getCheckoutPreviewByUserId(userId);
}

function validatePlaceOrderInput(input: PlaceOrderInput["form"]) {
  if (!EMAIL_PATTERN.test(input.email.trim().toLowerCase())) {
    throw new Error("請輸入有效電子郵件");
  }

  if (!input.firstName.trim() || !input.lastName.trim()) {
    throw new Error("請完整輸入姓名");
  }

  if (!input.phone.trim()) {
    throw new Error("請輸入電話號碼");
  }

  if (!input.addressQuery.trim()) {
    throw new Error("請輸入地址");
  }

  if (!input.billingSameAsShipping) {
    if (!input.billingFirstName.trim() || !input.billingLastName.trim()) {
      throw new Error("請完整輸入帳單姓名");
    }

    if (!input.billingAddress.trim()) {
      throw new Error("請輸入帳單地址");
    }

    if (!input.billingPhone.trim()) {
      throw new Error("請輸入帳單電話");
    }
  }
}

export async function placeOrderByUserId(input: PlaceOrderInput) {
  validatePlaceOrderInput(input.form);

  const context = await findCheckoutContext(input.userId);

  if (context.items.length === 0) {
    throw new Error("購物車是空的，無法建立訂單");
  }

  let activePromoCode: Prisma.PromoCodeGetPayload<Record<string, never>> | null = null;
  let promoDiscount = 0;

  if (context.cart.promoCode) {
    const found = await prisma.promoCode.findUnique({
      where: {
        code: context.cart.promoCode,
      },
    });

    if (found && isPromoCodeActive(found)) {
      activePromoCode = found;
      promoDiscount = Math.max(
        0,
        Math.min(
          buildCheckoutSummary(context.items, 0).subtotal,
          resolvePromoDiscountFromCode(found, buildCheckoutSummary(context.items, 0).subtotal),
        ),
      );
    }
  }

  const summary = buildCheckoutSummary(context.items, promoDiscount);
  const mappedPaymentMethod = mapPaymentMethod(input.paymentMethod);

  const createdOrder = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId: input.userId,
        cartId: context.cart.id,
        promoCodeId: activePromoCode?.id ?? null,
        status: "PENDING_PAYMENT",
        paymentMethod: mappedPaymentMethod,
        paymentStatus: "PENDING",
        email: input.form.email.trim().toLowerCase(),
        firstName: input.form.firstName.trim(),
        lastName: input.form.lastName.trim(),
        phone: input.form.phone.trim(),
        shippingAddressText: input.form.addressQuery.trim(),
        billingAddressText: input.form.billingSameAsShipping
          ? input.form.addressQuery.trim()
          : input.form.billingAddress.trim(),
        subtotal: summary.subtotal,
        originalSubtotal: summary.originalSubtotal,
        promoDiscount: summary.promoDiscount,
        shippingFee: summary.shippingFee,
        total: summary.total,
        savings: summary.savings,
        currency: "TWD",
        deliveryWindowLabel: DEFAULT_DELIVERY_WINDOW_LABEL,
        placedAt: new Date(),
        items: {
          create: context.cart.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            nameSnapshot: item.product.name,
            subtitleSnapshot: item.product.subtitle,
            imageSrcSnapshot: item.product.images[0]?.src ?? null,
            colorLabelSnapshot: item.variant.colorLabel,
            sizeLabelSnapshot: item.variant.sizeLabel,
            qty: item.qty,
            unitPrice: item.unitPrice,
            compareAtPrice: item.compareAtPrice,
            lineTotal: Number(item.unitPrice) * item.qty,
          })),
        },
        paymentAttempts: {
          create: {
            provider: mappedPaymentMethod,
            status: PaymentStatus.PENDING,
            amount: summary.total,
            currency: "TWD",
          },
        },
      },
      select: {
        id: true,
        status: true,
        paymentStatus: true,
        total: true,
        currency: true,
      },
    });

    if (activePromoCode) {
      await tx.promoCode.update({
        where: {
          id: activePromoCode.id,
        },
        data: {
          usedCount: {
            increment: 1,
          },
        },
      });
    }

    await tx.cart.update({
      where: {
        id: context.cart.id,
      },
      data: {
        status: CartStatus.CHECKED_OUT,
        checkedOutAt: new Date(),
        promoCode: null,
        promoDiscount: 0,
      },
    });

    await tx.cart.create({
      data: {
        userId: input.userId,
        status: CartStatus.ACTIVE,
        currency: "TWD",
        shippingFee: 0,
        serviceFee: 0,
        promoDiscount: 0,
      },
    });

    return order;
  });

  return {
    order: {
      id: createdOrder.id,
      status: createdOrder.status,
      paymentStatus: createdOrder.paymentStatus,
      total: Number(createdOrder.total),
      currency: createdOrder.currency,
    },
    redirectUrl: `/checkout/success?orderId=${encodeURIComponent(createdOrder.id)}`,
    paymentPreparation: {
      provider: "stripe",
      mode: "M7_PENDING",
      clientSecret: null as string | null,
    },
  };
}
