"use client";

import { useEffect, useState } from "react";
import { HomeFeaturedGrid } from "@/components/home/HomeFeaturedGrid";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeSportCarousel } from "@/components/home/HomeSportCarousel";
import { HomeSpotlightGrid } from "@/components/home/HomeSpotlightGrid";
import { homeContent, type HomeContent } from "@/content/home";
import { fetchHomeContentFromApi } from "@/lib/api/home";

export function HomePage() {
  const [content, setContent] = useState<HomeContent>(homeContent);

  useEffect(() => {
    let isMounted = true;

    async function loadHome() {
      try {
        const payload = await fetchHomeContentFromApi();

        if (!isMounted) {
          return;
        }

        setContent(payload);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("[HomePage] loadHome failed", error);
        setContent(homeContent);
      }
    }

    void loadHome();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-14 sm:space-y-20">
      <section className="relative left-1/2 right-1/2 -mx-[50vw] -mt-8 w-screen">
        <HomeHero {...content.hero} />
      </section>

      <section className="space-y-14 sm:space-y-20">
        <HomeFeaturedGrid items={content.featured} />

        <div className="mx-auto w-full max-w-[100rem] px-4 sm:px-6">
          <HomeSportCarousel items={content.sports} />
        </div>

        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-zinc-100 py-16 sm:py-24">
          <div className="mx-auto w-full max-w-[100rem] px-4 sm:px-6">
            <HomeSpotlightGrid
              title={content.spotlight.title}
              subtitle={content.spotlight.subtitle}
              items={content.spotlight.items}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
