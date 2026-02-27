"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchSnkrsDataFromApi, type SnkrsApiPayload } from "@/lib/api/snkrs";
import { snkrsContent } from "@/content/snkrs";
import { snkrsInStockCards, snkrsUpcomingCards } from "@/lib/snkrs/mock-snkrs-products";
import {
  snkrsMapCenters,
  snkrsShanghaiStores,
  snkrsTaiwanNorthStores,
  snkrsUserLocations,
} from "@/lib/snkrs/mock-snkrs-stores";
import type { SnkrsMapCity, SnkrsProductItem, SnkrsTab } from "@/lib/snkrs/types";

const PAGE_SIZE = 8;

function resolveSnkrsTab(raw: string | null): SnkrsTab {
  if (raw === "in-stock" || raw === "upcoming" || raw === "map") {
    return raw;
  }
  return "in-stock";
}

export function useSnkrsController() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = useMemo(() => resolveSnkrsTab(searchParams.get("tab")), [searchParams]);
  const [apiPayload, setApiPayload] = useState<SnkrsApiPayload | null>(null);
  const [visibleCountByTab, setVisibleCountByTab] = useState<Record<"in-stock" | "upcoming", number>>({
    "in-stock": PAGE_SIZE,
    upcoming: PAGE_SIZE,
  });

  const [mapCity, setMapCity] = useState<SnkrsMapCity>("taiwan-north");
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSnkrsData() {
      try {
        const payload = await fetchSnkrsDataFromApi();
        if (!isMounted) {
          return;
        }
        setApiPayload(payload);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        console.error("[useSnkrsController] loadSnkrsData failed", error);
        setApiPayload(null);
      }
    }

    void loadSnkrsData();

    return () => {
      isMounted = false;
    };
  }, []);

  const content = apiPayload?.content ?? snkrsContent;

  const productItems = useMemo<SnkrsProductItem[]>(() => {
    const inStockProducts = apiPayload?.products.inStock ?? snkrsInStockCards;
    const upcomingProducts = apiPayload?.products.upcoming ?? snkrsUpcomingCards;

    if (activeTab === "upcoming") {
      return upcomingProducts;
    }
    return inStockProducts;
  }, [activeTab, apiPayload?.products.inStock, apiPayload?.products.upcoming]);

  const visibleCount = activeTab === "upcoming" ? visibleCountByTab.upcoming : visibleCountByTab["in-stock"];

  const visibleProducts = useMemo(() => {
    if (activeTab === "map") {
      return [] as SnkrsProductItem[];
    }
    return productItems.slice(0, visibleCount);
  }, [activeTab, productItems, visibleCount]);

  const hasMoreProducts = activeTab !== "map" && visibleCount < productItems.length;

  const mapStores = useMemo(
    () =>
      mapCity === "taiwan-north"
        ? (apiPayload?.map.stores.taiwanNorth ?? snkrsTaiwanNorthStores)
        : (apiPayload?.map.stores.shanghai ?? snkrsShanghaiStores),
    [apiPayload?.map.stores.shanghai, apiPayload?.map.stores.taiwanNorth, mapCity],
  );
  const hasNearbyStores = mapStores.length > 0;
  const userLocation = (apiPayload?.map.userLocations ?? snkrsUserLocations)[mapCity];

  const selectedStore = useMemo(
    () => mapStores.find((store) => store.id === selectedStoreId) ?? null,
    [mapStores, selectedStoreId],
  );

  const mapCenter = useMemo(() => {
    if (selectedStore) {
      return {
        lat: selectedStore.lat,
        lng: selectedStore.lng,
        zoom: 14,
      };
    }

    return {
      lat: userLocation.lat,
      lng: userLocation.lng,
      zoom: (apiPayload?.map.centers ?? snkrsMapCenters)[mapCity].zoom,
    };
  }, [apiPayload?.map.centers, mapCity, selectedStore, userLocation]);

  const mapNearbyText = `${content.mapNearbyPrefix} ${mapStores.length} ${content.mapNearbySuffix}`;

  const onChangeTab = useCallback(
    (nextTab: SnkrsTab) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", nextTab);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const onLoadMore = useCallback(() => {
    if (activeTab === "map") {
      return;
    }

    setVisibleCountByTab((current) => {
      const key = activeTab === "upcoming" ? "upcoming" : "in-stock";
      return {
        ...current,
        [key]: current[key] + PAGE_SIZE,
      };
    });
  }, [activeTab]);

  const onExploreOtherCities = useCallback(() => {
    setMapCity((current) => (current === "taiwan-north" ? "shanghai" : "taiwan-north"));
    setSelectedStoreId(null);
  }, []);

  const onSelectStore = useCallback((storeId: string) => {
    setSelectedStoreId(storeId);
  }, []);

  const onSelectMyLocation = useCallback(() => {
    setSelectedStoreId(null);
  }, []);

  const onCloseStoreInfo = useCallback(() => {
    setSelectedStoreId(null);
  }, []);

  return {
    content,
    activeTab,
    visibleProducts,
    hasMoreProducts,
    mapStores,
    hasNearbyStores,
    userLocation,
    mapCenter,
    mapNearbyText,
    selectedStore,
    onChangeTab,
    onLoadMore,
    onExploreOtherCities,
    onSelectStore,
    onSelectMyLocation,
    onCloseStoreInfo,
  };
}
