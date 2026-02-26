export type SnkrsTab = "in-stock" | "upcoming" | "map";

export type SnkrsProductTab = Extract<SnkrsTab, "in-stock" | "upcoming">;

export type SnkrsProductItem = {
  id: string;
  slug: string;
  tab: SnkrsProductTab;
  subtitle: string;
  title: string;
  imageSrc: string;
  releaseMonth?: string;
  releaseDay?: number;
};

export type SnkrsMapCity = "taiwan-north" | "shanghai";

export type SnkrsMapCenter = {
  lat: number;
  lng: number;
  zoom: number;
};

export type SnkrsUserLocation = {
  label: string;
  city: string;
  lat: number;
  lng: number;
};

export type SnkrsStoreLocation = {
  id: string;
  name: string;
  city: string;
  distanceKm: number;
  shortLabel: string;
  lat: number;
  lng: number;
  address: string;
  detailUrl: string;
};
