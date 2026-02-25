import Link from "next/link";
import type { CSSProperties } from "react";

type HomeHeroProps = {
  title: string;
  subtitle: string;
  videoSrc: string;
  posterSrc: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
};

export function HomeHero({
  title,
  subtitle,
  videoSrc,
  posterSrc,
  primaryCta,
  secondaryCta,
}: Readonly<HomeHeroProps>) {
  return (
    <section className="relative h-[100vh] min-h-[520px] w-full overflow-hidden bg-black">
      <video
        className="h-full w-full object-cover"
        src={videoSrc}
        poster={posterSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />

      <div className="absolute bottom-[10%] left-1/2 w-full max-w-5xl -translate-x-1/2 px-6 text-center text-white">
        <h1 className="zoom-in-title text-5xl font-black uppercase leading-none tracking-tight sm:text-6xl lg:text-8xl">
          {title}
        </h1>
        <p className="fade-up-in mt-4 text-sm font-medium text-zinc-100 sm:text-base">{subtitle}</p>

        <div
          className="fade-up-in mt-6 flex flex-wrap items-center justify-center gap-3"
          style={{ "--anim-delay": "80ms" } as CSSProperties}
        >
          <Link
            href={primaryCta.href}
            className="rounded-full bg-white px-5 py-2 text-sm font-bold text-zinc-900 transition hover:bg-zinc-200"
          >
            {primaryCta.label}
          </Link>
          <Link
            href={secondaryCta.href}
            className="rounded-full bg-white px-5 py-2 text-sm font-bold text-zinc-900 transition hover:bg-zinc-200"
          >
            {secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
