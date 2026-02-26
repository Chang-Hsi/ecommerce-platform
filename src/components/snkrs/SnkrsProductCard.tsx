import Image from "next/image";
import Link from "next/link";
import type { SnkrsProductItem } from "@/lib/snkrs/types";

type SnkrsProductCardProps = {
  item: SnkrsProductItem;
  buyButtonLabel: string;
  upcomingButtonLabel: string;
};

export function SnkrsProductCard({ item, buyButtonLabel, upcomingButtonLabel }: Readonly<SnkrsProductCardProps>) {
  const detailHref = `/products/${item.slug}`;
  const buttonLabel = item.tab === "upcoming" ? upcomingButtonLabel : buyButtonLabel;
  const buttonClassName =
    item.tab === "upcoming"
      ? "inline-flex h-8 items-center rounded-full bg-zinc-200 px-4 text-sm font-semibold text-zinc-500"
      : "inline-flex h-8 items-center rounded-full bg-zinc-900 px-4 text-sm font-semibold text-white";

  return (
    <article className="flex h-full flex-col">
      <Link href={detailHref} className="block bg-zinc-100">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
          {item.releaseMonth && item.releaseDay ? (
            <div className="absolute left-3 top-3 z-10 text-zinc-900">
              <p className="text-base font-medium leading-none">{item.releaseMonth}</p>
              <p className="mt-1 text-5xl font-medium leading-none sm:text-4xl">{item.releaseDay}日</p>
            </div>
          ) : null}

          <Image
            src={item.imageSrc}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        </div>
      </Link>

      <div className="relative min-h-[82px] flex-1 px-1 pb-2 pt-2 sm:px-2">
        <p className="text-base text-zinc-500">{item.subtitle}</p>
        <Link href={detailHref} className="mt-0.5 block pr-20 text-base font-semibold tracking-tight text-zinc-900">
          {item.title}
        </Link>

        <Link href={detailHref} className={`${buttonClassName} absolute right-2 top-1/2 -translate-y-1/2`}>
          {buttonLabel}
        </Link>
      </div>
    </article>
  );
}
