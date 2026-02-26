import type { SnkrsStoreLocation } from "@/lib/snkrs/types";

type SnkrsStoreListProps = {
  stores: SnkrsStoreLocation[];
  selectedStoreId: string | null;
  onSelectStore: (storeId: string) => void;
};

export function SnkrsStoreList({ stores, selectedStoreId, onSelectStore }: Readonly<SnkrsStoreListProps>) {
  return (
    <ul className="divide-y divide-zinc-200">
      {stores.map((store) => {
        const isSelected = store.id === selectedStoreId;

        return (
          <li key={store.id}>
            <button
              type="button"
              onClick={() => onSelectStore(store.id)}
              className={`flex w-full items-center gap-4 px-6 py-4 text-left transition-colors ${
                isSelected ? "bg-zinc-100" : "bg-white hover:bg-zinc-50"
              }`}
            >
              <span className="inline-flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-md bg-black text-base font-semibold text-white">
                {store.shortLabel}
              </span>

              <span className="min-w-0 space-y-1">
                <span className="block text-base font-medium text-zinc-900">{store.name}</span>
                <span className="block text-base text-zinc-700">{store.city}</span>
                <span className="block text-sm text-zinc-500">{store.distanceKm} 公里</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
