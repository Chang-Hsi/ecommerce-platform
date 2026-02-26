import type { SnkrsTab } from "@/lib/snkrs/types";

export const snkrsContent = {
  tabs: [
    { value: "in-stock", label: "現貨" },
    { value: "upcoming", label: "即將推出" },
    { value: "map", label: "地圖" },
  ] as Array<{ value: SnkrsTab; label: string }>,
  buyButtonLabel: "購買",
  upcomingButtonLabel: "即將推出",
  loadMoreLabel: "載入更多",
  mapTitle: "探索你的周邊地區",
  mapNearbyPrefix: "你附近有",
  mapNearbySuffix: "個地點",
  mapMyLocationTitle: "模擬我的位置",
  mapMyLocationButtonLabel: "我的位置",
  mapMyLocationTooltipLabel: "你在這裡",
  mapEmptyTitle: "附近目前沒有新鮮事",
  mapEmptyDescription: "我們會在地圖上新增門市、活動和社群空間，請稍後再回來看看。",
  mapExploreOtherCityLabel: "探索其他城市",
  mapAddressLabel: "地址",
  mapDetailLabel: "查看詳細資訊",
  mapCloseInfoLabel: "關閉據點資訊",
  mapCloseMapOverlayLabel: "關閉地圖浮層",
} as const;
