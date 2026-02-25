import { HomeFeaturedGrid } from "@/components/home/HomeFeaturedGrid";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeSportCarousel } from "@/components/home/HomeSportCarousel";
import { HomeSpotlightGrid } from "@/components/home/HomeSpotlightGrid";
import { homeContent } from "@/content/home";

export function HomePage() {
  return (
    <div className="space-y-14 sm:space-y-20">
      <section className="relative left-1/2 right-1/2 -mx-[50vw] -mt-8 w-screen">
        <HomeHero {...homeContent.hero} />
      </section>

      <section className="space-y-14 sm:space-y-20">
        <HomeFeaturedGrid items={homeContent.featured} />

        <div className="mx-auto w-full max-w-[100rem] px-4 sm:px-6">
          <HomeSportCarousel items={homeContent.sports} />
        </div>

        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-zinc-100 py-16 sm:py-24">
          <div className="mx-auto w-full max-w-[100rem] px-4 sm:px-6">
            <HomeSpotlightGrid
              title={homeContent.spotlight.title}
              subtitle={homeContent.spotlight.subtitle}
              items={homeContent.spotlight.items}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
