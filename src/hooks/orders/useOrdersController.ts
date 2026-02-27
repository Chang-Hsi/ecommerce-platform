"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { productsContent } from "@/content/products";
import { fetchOrdersFromApi } from "@/lib/api/orders";
import { resolveSafeRedirect } from "@/lib/auth/mock-auth";
import type { OrderView } from "@/lib/orders/types";
import { useMockAuthSession } from "@/hooks/auth/useMockAuthSession";

export function useOrdersController() {
  const router = useRouter();
  const { isAuthenticated, isReady } = useMockAuthSession();
  const [orders, setOrders] = useState<OrderView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!isAuthenticated) {
      const redirect = resolveSafeRedirect("/orders");
      router.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    let cancelled = false;

    void fetchOrdersFromApi()
      .then((payload) => {
        if (cancelled) {
          return;
        }
        setOrders(payload);
        setErrorMessage(null);
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }
        setErrorMessage(error instanceof Error ? error.message : "讀取訂單失敗");
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isReady, router]);

  const recommendationItems = useMemo(() => {
    const purchasedSlugs = new Set(
      orders.flatMap((order) => order.items.map((item) => item.slug).filter((slug): slug is string => Boolean(slug))),
    );

    const filtered = productsContent.filter((item) => !purchasedSlugs.has(item.slug));
    const source = filtered.length > 0 ? filtered : productsContent;
    return source.slice(0, 6);
  }, [orders]);

  return {
    isReady,
    isAuthenticated,
    orders,
    isLoading,
    errorMessage,
    recommendationItems,
  };
}
