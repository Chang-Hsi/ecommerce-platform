import type { SnkrsMapCenter, SnkrsStoreLocation, SnkrsUserLocation, SnkrsProductItem } from "@/lib/snkrs/types";
import { request } from "@/lib/api/request";

export type SnkrsApiPayload = {
  content: {
    tabs: Array<{ value: "in-stock" | "upcoming" | "map"; label: string }>;
    buyButtonLabel: string;
    upcomingButtonLabel: string;
    loadMoreLabel: string;
    mapTitle: string;
    mapNearbyPrefix: string;
    mapNearbySuffix: string;
    mapMyLocationTitle: string;
    mapMyLocationButtonLabel: string;
    mapMyLocationTooltipLabel: string;
    mapEmptyTitle: string;
    mapEmptyDescription: string;
    mapExploreOtherCityLabel: string;
    mapAddressLabel: string;
    mapDetailLabel: string;
    mapCloseInfoLabel: string;
    mapCloseMapOverlayLabel: string;
  };
  products: {
    inStock: SnkrsProductItem[];
    upcoming: SnkrsProductItem[];
  };
  map: {
    centers: Record<"taiwan-north" | "shanghai", SnkrsMapCenter>;
    userLocations: Record<"taiwan-north" | "shanghai", SnkrsUserLocation>;
    stores: {
      taiwanNorth: SnkrsStoreLocation[];
      shanghai: SnkrsStoreLocation[];
    };
  };
};

export async function fetchSnkrsDataFromApi() {
  const payload = await request<SnkrsApiPayload>("/api/snkrs", {
    cache: "no-store",
  });

  return payload.data;
}
