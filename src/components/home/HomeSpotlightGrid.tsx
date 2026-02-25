import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { HomeSpotlightItem } from "@/content/home";

type HomeSpotlightGridProps = {
  title: string;
  subtitle: string;
  items: HomeSpotlightItem[];
};

export function HomeSpotlightGrid({ title, subtitle, items }: Readonly<HomeSpotlightGridProps>) {
  return (
    <section className="space-y-10 sm:space-y-14">
      <header className="space-y-3 text-center">
        <h2 className="zoom-in-title text-5xl font-black tracking-tight text-zinc-900 sm:text-7xl lg:text-8xl">
          {title}
        </h2>
        <p className="mx-auto max-w-3xl pt-4 text-base font-medium text-zinc-700 sm:text-xl">{subtitle}</p>
      </header>

      <div className="sm:hidden">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="fade-up-in w-36 shrink-0 rounded-xl bg-white p-3 text-center shadow-sm"
            >
              <Image src={item.imageSrc} alt={item.name} width={120} height={72} className="mx-auto h-12 w-auto" />
              <p className="mt-2 text-xs font-semibold text-zinc-800">{item.name}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="hidden grid-cols-4 gap-x-6 gap-y-10 sm:grid lg:grid-cols-8">
        {items.map((item, index) => (
          <Link
            key={item.name}
            href={item.href}
            className="fade-up-in text-center"
            style={{ "--anim-delay": `${index * 35}ms` } as CSSProperties}
          >
            <Image
              src={item.imageSrc}
              alt={item.name}
              width={120}
              height={72}
              className="mx-auto h-14 w-auto transition duration-300 hover:scale-105"
            />
            <p className="mt-3 text-lg font-semibold text-zinc-900">{item.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
