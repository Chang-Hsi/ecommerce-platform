"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
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
  const [visibleCountByTab, setVisibleCountByTab] = useState<Record<"in-stock" | "upcoming", number>>({
    "in-stock": PAGE_SIZE,
    upcoming: PAGE_SIZE,
  });

  const [mapCity, setMapCity] = useState<SnkrsMapCity>("taiwan-north");
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  const productItems = useMemo<SnkrsProductItem[]>(() => {
    if (activeTab === "upcoming") {
      return snkrsUpcomingCards;
    }
    return snkrsInStockCards;
  }, [activeTab]);

  const visibleCount = activeTab === "upcoming" ? visibleCountByTab.upcoming : visibleCountByTab["in-stock"];

  const visibleProducts = useMemo(() => {
    if (activeTab === "map") {
      return [] as SnkrsProductItem[];
    }
    return productItems.slice(0, visibleCount);
  }, [activeTab, productItems, visibleCount]);

  const hasMoreProducts = activeTab !== "map" && visibleCount < productItems.length;

  const mapStores = useMemo(
    () => (mapCity === "taiwan-north" ? snkrsTaiwanNorthStores : snkrsShanghaiStores),
    [mapCity],
  );
  const hasNearbyStores = mapStores.length > 0;
  const userLocation = snkrsUserLocations[mapCity];

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
      zoom: snkrsMapCenters[mapCity].zoom,
    };
  }, [mapCity, selectedStore, userLocation]);

  const mapNearbyText = `${snkrsContent.mapNearbyPrefix} ${mapStores.length} ${snkrsContent.mapNearbySuffix}`;

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
    content: snkrsContent,
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
