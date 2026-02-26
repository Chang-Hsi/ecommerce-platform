"use client";

import { SnkrsLoadMoreButton } from "@/components/snkrs/SnkrsLoadMoreButton";
import { SnkrsMapPanel } from "@/components/snkrs/SnkrsMapPanel";
import { SnkrsProductGrid } from "@/components/snkrs/SnkrsProductGrid";
import { SnkrsTabs } from "@/components/snkrs/SnkrsTabs";
import { useSnkrsController } from "@/hooks/snkrs/useSnkrsController";

export function SnkrsPage() {
  const {
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
  } = useSnkrsController();

  return (
    <div className="relative left-1/2 right-1/2 -mx-[50vw] -mt-8 w-screen bg-[var(--background)]">
      <header className="border-y border-zinc-200 bg-white">
        <div className="mx-auto flex h-12 max-w-[1360px] items-end gap-8 px-4 sm:px-6 lg:px-8">
          <SnkrsTabs tabs={content.tabs} activeTab={activeTab} onChangeTab={onChangeTab} />
        </div>
      </header>

      {activeTab === "map" ? (
        <SnkrsMapPanel
          title={content.mapTitle}
          nearbyText={mapNearbyText}
          stores={mapStores}
          hasNearbyStores={hasNearbyStores}
          myLocationTitle={content.mapMyLocationTitle}
          myLocationButtonLabel={content.mapMyLocationButtonLabel}
          myLocationTooltipLabel={content.mapMyLocationTooltipLabel}
          userLocation={userLocation}
          center={mapCenter}
          selectedStore={selectedStore}
          onSelectStore={onSelectStore}
          onSelectMyLocation={onSelectMyLocation}
          onCloseStoreInfo={onCloseStoreInfo}
          emptyTitle={content.mapEmptyTitle}
          emptyDescription={content.mapEmptyDescription}
          exploreOtherCityLabel={content.mapExploreOtherCityLabel}
          onExploreOtherCities={onExploreOtherCities}
          addressLabel={content.mapAddressLabel}
          detailLabel={content.mapDetailLabel}
          closeInfoLabel={content.mapCloseInfoLabel}
        />
      ) : (
        <section className="mx-auto max-w-[1560px] px-4 py-8 sm:px-6 lg:px-8">
          <SnkrsProductGrid
            items={visibleProducts}
            buyButtonLabel={content.buyButtonLabel}
            upcomingButtonLabel={content.upcomingButtonLabel}
          />

          {hasMoreProducts ? (
            <SnkrsLoadMoreButton label={content.loadMoreLabel} onClick={onLoadMore} />
          ) : null}
        </section>
      )}
    </div>
  );
}
