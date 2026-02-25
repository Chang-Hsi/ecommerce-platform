import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { HomeFeaturedItem } from "@/content/home";

type HomeFeaturedGridProps = {
  items: HomeFeaturedItem[];
};

export function HomeFeaturedGrid({ items }: Readonly<HomeFeaturedGridProps>) {
  return (
    <section className="space-y-5">
      <div className="mx-auto w-full px-4 sm:px-6">
        <h2 className="text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl">精選</h2>
      </div>

      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {items.map((item, index) => (
            <Link
              key={item.title}
              href={item.href}
              className="group fade-up-in relative min-h-[48vh] overflow-hidden bg-zinc-900 md:min-h-[56vh]"
              style={{ "--anim-delay": `${index * 60}ms` } as CSSProperties}
            >
              <Image
                src={item.imageSrc}
                alt={item.title}
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

              <div className="absolute bottom-5 left-5 space-y-3 text-white">
                <h3 className="text-2xl font-black tracking-tight sm:text-3xl">{item.title}</h3>
                <span className="inline-flex rounded-full bg-white px-4 py-1.5 text-sm font-bold text-zinc-900">
                  選購
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
