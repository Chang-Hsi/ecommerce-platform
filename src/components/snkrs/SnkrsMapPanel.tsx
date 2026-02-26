"use client";

import { useEffect, useRef } from "react";
import { SnkrsStoreInfoCard } from "@/components/snkrs/SnkrsStoreInfoCard";
import { SnkrsStoreList } from "@/components/snkrs/SnkrsStoreList";
import type { SnkrsMapCenter, SnkrsStoreLocation, SnkrsUserLocation } from "@/lib/snkrs/types";
import type { LayerGroup, Map as LeafletMap } from "leaflet";

type SnkrsMapPanelProps = {
  title: string;
  nearbyText: string;
  stores: SnkrsStoreLocation[];
  hasNearbyStores: boolean;
  myLocationTitle: string;
  myLocationButtonLabel: string;
  myLocationTooltipLabel: string;
  userLocation: SnkrsUserLocation;
  center: SnkrsMapCenter;
  selectedStore: SnkrsStoreLocation | null;
  onSelectStore: (storeId: string) => void;
  onSelectMyLocation: () => void;
  onCloseStoreInfo: () => void;
  emptyTitle: string;
  emptyDescription: string;
  exploreOtherCityLabel: string;
  onExploreOtherCities: () => void;
  addressLabel: string;
  detailLabel: string;
  closeInfoLabel: string;
};

let leafletModulePromise: Promise<typeof import("leaflet")> | null = null;

function loadLeaflet() {
  if (!leafletModulePromise) {
    leafletModulePromise = import("leaflet");
  }

  return leafletModulePromise;
}

export function SnkrsMapPanel({
  title,
  nearbyText,
  stores,
  hasNearbyStores,
  myLocationButtonLabel,
  myLocationTooltipLabel,
  userLocation,
  center,
  selectedStore,
  onSelectStore,
  onSelectMyLocation,
  onCloseStoreInfo,
  emptyTitle,
  emptyDescription,
  exploreOtherCityLabel,
  onExploreOtherCities,
  addressLabel,
  detailLabel,
  closeInfoLabel,
}: Readonly<SnkrsMapPanelProps>) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersLayerRef = useRef<LayerGroup | null>(null);
  const initialCenterRef = useRef(center);

  useEffect(() => {
    let isDisposed = false;

    async function initializeMap() {
      if (!mapContainerRef.current || mapRef.current) {
        return;
      }

      const L = await loadLeaflet();
      if (isDisposed || !mapContainerRef.current || mapRef.current) {
        return;
      }

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: true,
      }).setView([initialCenterRef.current.lat, initialCenterRef.current.lng], initialCenterRef.current.zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
      }).addTo(map);

      L.control
        .zoom({
          position: "bottomright",
        })
        .addTo(map);

      mapRef.current = map;
    }

    void initializeMap();

    return () => {
      isDisposed = true;
      markersLayerRef.current?.remove();
      markersLayerRef.current = null;
      const map = mapRef.current;
      if (map) {
        map.remove();
      }
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    map.flyTo([center.lat, center.lng], center.zoom, {
      animate: true,
      duration: 0.65,
    });
  }, [center.lat, center.lng, center.zoom]);

  useEffect(() => {
    let isDisposed = false;

    async function syncMarkers() {
      const map = mapRef.current;
      if (!map) {
        return;
      }

      const L = await loadLeaflet();
      if (isDisposed) {
        return;
      }

      markersLayerRef.current?.remove();

      const markersLayer = L.layerGroup();

      const userMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: L.divIcon({
          className: "",
          html: '<span class="snkrs-map-user-marker"></span>',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        }),
      });
      userMarker.bindTooltip(myLocationTooltipLabel, {
        permanent: true,
        direction: "top",
        offset: [0, -10],
        className: "snkrs-map-user-tooltip",
      });
      userMarker.on("click", () => {
        onSelectMyLocation();
      });
      userMarker.addTo(markersLayer);

      for (const store of stores) {
        const isSelected = selectedStore?.id === store.id;
        const marker = L.marker([store.lat, store.lng], {
          icon: L.divIcon({
            className: "",
            html: `<span class=\"snkrs-map-marker${isSelected ? " is-selected" : ""}\"></span>`,
            iconSize: [26, 26],
            iconAnchor: [13, 13],
          }),
        });

        marker.on("click", () => {
          onSelectStore(store.id);
        });

        marker.addTo(markersLayer);
      }

      markersLayer.addTo(map);
      markersLayerRef.current = markersLayer;
    }

    void syncMarkers();

    return () => {
      isDisposed = true;
    };
  }, [stores, selectedStore, userLocation, myLocationTooltipLabel, onSelectStore, onSelectMyLocation]);

  return (
    <section className="snkrs-map-root grid min-h-[calc(100vh-168px)] grid-cols-1 border-y border-zinc-200 bg-white lg:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="order-2 border-t border-zinc-200 lg:order-1 lg:border-r lg:border-t-0">
        <header className="px-6 py-6">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">{title}</h1>
          <p className="mt-2 text-sm text-zinc-500">{nearbyText}</p>
        </header>

        <section className="border-t border-b border-zinc-200 px-6 py-4">
          <button
            type="button"
            onClick={onSelectMyLocation}
            className={`mt-1 w-full px-3 py-2 text-left transition-colors ${
              selectedStore
                ? "bg-white hover:bg-zinc-50"
                : "bg-white text-zinc-900"
            }`}
          >
            <p className={`text-base font-medium ${selectedStore ? "text-zinc-900" : "text-zinc-900"}`}>
              {myLocationButtonLabel}
            </p>
            <p className={`text-sm ${selectedStore ? "text-zinc-600" : "text-zinc-900"}`}>{userLocation.label}</p>
            <p className={`text-sm ${selectedStore ? "text-zinc-600" : "text-zinc-900"}`}>{userLocation.city}</p>
          </button>
        </section>

        {hasNearbyStores ? (
          <div className="h-[420px] overflow-y-auto lg:h-[calc(100vh-168px-193px)]">
            <SnkrsStoreList
              stores={stores}
              selectedStoreId={selectedStore?.id ?? null}
              onSelectStore={onSelectStore}
            />
          </div>
        ) : null}
      </aside>

      <div className="relative order-1 min-h-[420px] lg:order-2 lg:min-h-[calc(100vh-168px)]">
        <div ref={mapContainerRef} className="h-full w-full" aria-label="SNKRS 地圖" role="region" />

        {!hasNearbyStores ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
            <section className="pointer-events-auto w-full max-w-[420px] rounded-3xl bg-white p-8 shadow-[0_20px_44px_rgba(0,0,0,0.16)]">
              <h2 className="text-5xl font-semibold text-zinc-900 sm:text-4xl">{emptyTitle}</h2>
              <p className="mt-4 text-base leading-7 text-zinc-700">{emptyDescription}</p>
              <button
                type="button"
                onClick={onExploreOtherCities}
                className="mt-6 inline-flex h-10 items-center rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white"
              >
                {exploreOtherCityLabel}
              </button>
            </section>
          </div>
        ) : null}

        {selectedStore ? (
          <div className="pointer-events-none absolute left-4 top-4 z-20 lg:left-6 lg:top-6">
            <SnkrsStoreInfoCard
              store={selectedStore}
              addressLabel={addressLabel}
              detailLabel={detailLabel}
              closeLabel={closeInfoLabel}
              onClose={onCloseStoreInfo}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
