import { OrderStatus, PaymentStatus, type Prisma } from "@prisma/client";
import type { OrderView } from "@/lib/orders/types";
import { prisma } from "@/lib/prisma";

function decimalToNumber(value: Prisma.Decimal | null | undefined) {
  if (value === null || value === undefined) {
    return 0;
  }

  return Number(value);
}

export async function listCompletedOrdersByUser(userId: string): Promise<OrderView[]> {
  const orders = await prisma.order.findMany({
    where: {
      userId,
      OR: [
        {
          status: {
            in: [OrderStatus.PAID, OrderStatus.REFUNDED],
          },
        },
        {
          paymentStatus: PaymentStatus.CAPTURED,
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          product: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  });

  return orders.map((order) => ({
    id: order.id,
    status: order.status,
    paymentStatus: order.paymentStatus,
    total: Number(order.total),
    currency: order.currency,
    deliveryWindowLabel: order.deliveryWindowLabel ?? "",
    placedAt: order.placedAt?.toISOString() ?? null,
    items: order.items.map((item) => ({
      id: item.id,
      slug: item.product?.slug ?? null,
      name: item.nameSnapshot,
      subtitle: item.subtitleSnapshot ?? "",
      imageSrc: item.imageSrcSnapshot ?? "",
      colorLabel: item.colorLabelSnapshot ?? "",
      sizeLabel: item.sizeLabelSnapshot ?? "",
      qty: item.qty,
      unitPrice: Number(item.unitPrice),
      lineTotal: Number(item.lineTotal),
      compareAtPrice: decimalToNumber(item.compareAtPrice) || undefined,
    })),
  }));
}
