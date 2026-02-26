import type { SnkrsStoreLocation } from "@/lib/snkrs/types";

type SnkrsStoreInfoCardProps = {
  store: SnkrsStoreLocation;
  addressLabel: string;
  detailLabel: string;
  closeLabel: string;
  onClose: () => void;
};

export function SnkrsStoreInfoCard({
  store,
  addressLabel,
  detailLabel,
  closeLabel,
  onClose,
}: Readonly<SnkrsStoreInfoCardProps>) {
  return (
    <section className="pointer-events-auto w-full max-w-[360px] rounded-2xl bg-white p-5 shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-5xl font-semibold text-zinc-900 sm:text-4xl">{store.name}</h3>
          <p className="mt-2 text-2xl font-medium text-zinc-700 sm:text-xl">{store.city}</p>
          <p className="text-base text-zinc-500">{store.distanceKm} 公里</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-700"
          aria-label={closeLabel}
        >
          <span className="text-2xl leading-none">×</span>
        </button>
      </div>

      <a href={store.detailUrl} className="mt-3 inline-flex text-sm font-medium text-zinc-800 underline underline-offset-2">
        {detailLabel}
      </a>

      <div className="mt-4 rounded-lg border border-zinc-200 p-4">
        <p className="text-sm text-zinc-500">{addressLabel}</p>
        <p className="mt-1 whitespace-pre-line text-sm font-medium text-zinc-800">{store.address}</p>
      </div>
    </section>
  );
}
