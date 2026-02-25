"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { HomeSportItem } from "@/content/home";

type HomeSportCarouselProps = {
  items: HomeSportItem[];
};

export function HomeSportCarousel({ items }: Readonly<HomeSportCarouselProps>) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  function scrollCards(direction: "prev" | "next") {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const firstCard = track.querySelector("[data-sport-card]") as HTMLElement | null;
    const delta = (firstCard?.offsetWidth ?? 320) + 16;

    track.scrollBy({
      left: direction === "next" ? delta : -delta,
      behavior: "smooth",
    });
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-black tracking-tight text-zinc-900 sm:text-4xl">依運動項目選購</h2>

        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollCards("prev")}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 transition hover:bg-zinc-300"
            aria-label="上一組運動項目"
          >
            <ChevronLeftIcon className="h-6 w-6" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollCards("next")}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-200 text-zinc-700 transition hover:bg-zinc-300"
            aria-label="下一組運動項目"
          >
            <ChevronRightIcon className="h-6 w-6" aria-hidden />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex w-full gap-4 overflow-x-auto pb-3"
        role="region"
        aria-label="運動項目滑動列表"
      >
        {items.map((item) => (
          <Link key={item.name} href={item.href} data-sport-card className="group w-[280px] shrink-0 sm:w-[320px]">
            <div className="relative h-[390px] overflow-hidden rounded-xl bg-zinc-200 sm:h-[460px]">
              <Image
                src={item.imageSrc}
                alt={item.name}
                fill
                sizes="(max-width: 639px) 280px, 320px"
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <h3 className="mt-3 text-3xl font-black tracking-tight text-zinc-900">{item.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
