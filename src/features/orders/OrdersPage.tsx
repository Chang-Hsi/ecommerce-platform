"use client";

import Image from "next/image";
import Link from "next/link";
import { CartFavoritesSection } from "@/components/cart/CartFavoritesSection";
import { ProductRecommendations } from "@/components/products/ProductRecommendations";
import { formatPrice } from "@/lib/cart/mock-cart";
import type { OrderItemView, OrderView } from "@/lib/orders/types";
import { useOrdersController } from "@/hooks/orders/useOrdersController";

function formatDateLabel(value: string | null) {
  if (!value) {
    return "—";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  const year = parsed.getFullYear();
  const month = `${parsed.getMonth() + 1}`.padStart(2, "0");
  const day = `${parsed.getDate()}`.padStart(2, "0");
  return `${year}/${month}/${day}`;
}

function OrderLineItem({ item }: Readonly<{ item: OrderItemView }>) {
  const imageContent = item.imageSrc ? (
    <Image src={item.imageSrc} alt={item.name} fill sizes="(max-width: 639px) 100vw, 138px" className="object-cover" />
  ) : null;

  return (
    <article className="border-b border-zinc-200 pb-6 last:border-b-0 last:pb-0">
      <div className="grid gap-3 sm:grid-cols-[138px_minmax(0,1fr)_150px] sm:gap-4">
        {item.slug ? (
          <Link href={`/products/${item.slug}`} className="relative block h-[96px] overflow-hidden bg-zinc-100 sm:h-[112px]">
            {imageContent}
          </Link>
        ) : (
          <div className="relative block h-[96px] overflow-hidden bg-zinc-100 sm:h-[112px]">{imageContent}</div>
        )}

        <div className="space-y-0.5 text-zinc-700">
          {item.slug ? (
            <Link href={`/products/${item.slug}`} className="block text-xl font-medium leading-snug text-zinc-900 hover:underline">
              {item.name}
            </Link>
          ) : (
            <p className="text-xl font-medium leading-snug text-zinc-900">{item.name}</p>
          )}
          <p className="text-base text-zinc-500">{item.subtitle}</p>
          <p className="text-base">{item.colorLabel}</p>
          <p className="text-base">尺寸 {item.sizeLabel || "—"}</p>
          <p className="text-base">數量 {item.qty}</p>
        </div>

        <div className="space-y-0.5 text-left sm:text-right">
          {item.compareAtPrice ? (
            <p className="text-xl text-zinc-500 line-through">{formatPrice(item.compareAtPrice * item.qty)}</p>
          ) : null}
          <p className="text-2xl font-medium text-zinc-900">{formatPrice(item.lineTotal)}</p>
        </div>
      </div>
    </article>
  );
}

function OrderCard({ order }: Readonly<{ order: OrderView }>) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-200 pb-4">
        <div className="space-y-1">
          <p className="text-sm text-zinc-500">訂單編號</p>
          <p className="text-base font-medium text-zinc-900">{order.id}</p>
          <p className="text-sm text-zinc-500">下單日期 {formatDateLabel(order.placedAt)}</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm text-zinc-500">付款狀態</p>
          <p className="text-base font-semibold text-emerald-700">{order.paymentStatus === "CAPTURED" ? "已完成" : order.paymentStatus}</p>
          <p className="mt-1 text-sm text-zinc-500">{order.deliveryWindowLabel || "配送資訊待更新"}</p>
        </div>
      </div>

      <div className="space-y-5 pt-5">
        {order.items.map((item) => (
          <OrderLineItem key={item.id} item={item} />
        ))}
      </div>

      <div className="mt-5 border-t border-zinc-200 pt-4 text-right">
        <p className="text-sm text-zinc-500">訂單總計</p>
        <p className="text-2xl font-semibold text-zinc-900">{formatPrice(order.total)}</p>
      </div>
    </article>
  );
}

export function OrdersPage() {
  const { isReady, isAuthenticated, orders, isLoading, errorMessage, recommendationItems } = useOrdersController();

  if (!isReady || !isAuthenticated) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10">
      <section className="space-y-6">
        <h1 className="text-4xl font-semibold text-zinc-900 sm:text-2xl">訂單</h1>

        {isLoading ? <p className="text-base text-zinc-600">訂單載入中...</p> : null}
        {errorMessage ? <p className="text-base text-red-600">{errorMessage}</p> : null}

        {!isLoading && !errorMessage && orders.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <p className="text-base text-zinc-700">目前尚無已完成訂單。</p>
            <Link href="/products" className="mt-3 inline-flex text-base font-medium text-zinc-900 underline">
              繼續選購
            </Link>
          </div>
        ) : null}

        {!isLoading && !errorMessage && orders.length > 0 ? (
          <div className="space-y-2">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : null}
      </section>

      <CartFavoritesSection />

      <ProductRecommendations items={recommendationItems} />
    </div>
  );
}
