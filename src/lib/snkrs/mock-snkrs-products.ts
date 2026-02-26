import { productsContent } from "@/content/products";
import type { SnkrsProductItem } from "@/lib/snkrs/types";

const productBySlug = new Map(productsContent.map((product) => [product.slug, product]));

type BuildSnkrsCardInput = {
  id: string;
  slug: string;
  tab: SnkrsProductItem["tab"];
  subtitle: string;
  title: string;
  releaseMonth?: string;
  releaseDay?: number;
};

function buildSnkrsCard(input: BuildSnkrsCardInput): SnkrsProductItem {
  const source = productBySlug.get(input.slug);
  if (!source) {
    throw new Error(`SNKRS mock product slug not found: ${input.slug}`);
  }

  return {
    id: input.id,
    slug: input.slug,
    tab: input.tab,
    subtitle: input.subtitle,
    title: input.title,
    imageSrc: source.imageSrc,
    releaseMonth: input.releaseMonth,
    releaseDay: input.releaseDay,
  };
}

const snkrsCards: SnkrsProductItem[] = [
  buildSnkrsCard({
    id: "in-stock-1",
    slug: "air-max-95-big-bubble",
    tab: "in-stock",
    subtitle: "Air Max 95 Big Bubble",
    title: "Seongsu",
  }),
  buildSnkrsCard({
    id: "in-stock-2",
    slug: "cortez-leather",
    tab: "in-stock",
    subtitle: "女款 LD-1000",
    title: "Cargo Khaki and Medium Olive",
  }),
  buildSnkrsCard({
    id: "in-stock-3",
    slug: "dunk-low-retro",
    tab: "in-stock",
    subtitle: "女款 LD-1000",
    title: "Pearl White and Light Bone",
  }),
  buildSnkrsCard({
    id: "in-stock-4",
    slug: "air-jordan-1-low",
    tab: "in-stock",
    subtitle: "Paul Rodriguez Zoom Air 低筒鞋",
    title: "Habanero Red and Team Red",
  }),
  buildSnkrsCard({
    id: "in-stock-5",
    slug: "metcon-10",
    tab: "in-stock",
    subtitle: "G.T. Future EP",
    title: "Metallic Red Bronze",
  }),
  buildSnkrsCard({
    id: "in-stock-6",
    slug: "sabrina-2",
    tab: "in-stock",
    subtitle: "女款 Air Rift",
    title: "Black",
  }),
  buildSnkrsCard({
    id: "in-stock-7",
    slug: "pegasus-premium",
    tab: "in-stock",
    subtitle: "女款 Air Rift",
    title: "Fir",
  }),
  buildSnkrsCard({
    id: "in-stock-8",
    slug: "air-max-95-og",
    tab: "in-stock",
    subtitle: "Air Max Goadome 低筒鞋",
    title: "Taupe and Black",
  }),
  buildSnkrsCard({
    id: "in-stock-9",
    slug: "air-force-1-07",
    tab: "in-stock",
    subtitle: "Air Max Goadome 低筒鞋",
    title: "Black",
  }),
  buildSnkrsCard({
    id: "in-stock-10",
    slug: "zoom-fly-6",
    tab: "in-stock",
    subtitle: "Zoom Fly 6",
    title: "Summit White and Black",
  }),
  buildSnkrsCard({
    id: "in-stock-11",
    slug: "vomero-plus",
    tab: "in-stock",
    subtitle: "Vomero Plus",
    title: "Laser Orange",
  }),
  buildSnkrsCard({
    id: "in-stock-12",
    slug: "nike-air-max-95-kids",
    tab: "in-stock",
    subtitle: "Nike Air Max '95",
    title: "White and Crimson",
  }),
  buildSnkrsCard({
    id: "upcoming-1",
    slug: "air-jordan-1-low",
    tab: "upcoming",
    subtitle: "Air Jordan 1 x Union x Fragment",
    title: "Black and Varsity Red",
    releaseMonth: "2月",
    releaseDay: 27,
  }),
  buildSnkrsCard({
    id: "upcoming-2",
    slug: "nike-air-max-95-kids",
    tab: "upcoming",
    subtitle: "Jordan x Union x Fragment",
    title: "服飾系列",
    releaseMonth: "2月",
    releaseDay: 27,
  }),
  buildSnkrsCard({
    id: "upcoming-3",
    slug: "metcon-10",
    tab: "upcoming",
    subtitle: "Air Jordan 5 Retro",
    title: "Light Graphite and Wolf Grey",
    releaseMonth: "2月",
    releaseDay: 28,
  }),
  buildSnkrsCard({
    id: "upcoming-4",
    slug: "air-max-95-og",
    tab: "upcoming",
    subtitle: "Air Max 90",
    title: "Vast Grey and Cool Grey",
    releaseMonth: "3月",
    releaseDay: 1,
  }),
  buildSnkrsCard({
    id: "upcoming-5",
    slug: "dunk-low-retro",
    tab: "upcoming",
    subtitle: "KD 18 EP",
    title: "Green Strike and Varsity Red",
    releaseMonth: "3月",
    releaseDay: 1,
  }),
  buildSnkrsCard({
    id: "upcoming-6",
    slug: "pegasus-premium",
    tab: "upcoming",
    subtitle: "Pegasus Premium",
    title: "Mint Foam",
    releaseMonth: "3月",
    releaseDay: 3,
  }),
  buildSnkrsCard({
    id: "upcoming-7",
    slug: "air-force-1-07",
    tab: "upcoming",
    subtitle: "Air Force 1 '07",
    title: "Triple Black",
    releaseMonth: "3月",
    releaseDay: 3,
  }),
  buildSnkrsCard({
    id: "upcoming-8",
    slug: "cortez-leather",
    tab: "upcoming",
    subtitle: "Cortez Leather",
    title: "Pine and Team Orange",
    releaseMonth: "3月",
    releaseDay: 3,
  }),
  buildSnkrsCard({
    id: "upcoming-9",
    slug: "sabrina-2",
    tab: "upcoming",
    subtitle: "Sabrina 2",
    title: "Pink and Crimson",
    releaseMonth: "3月",
    releaseDay: 6,
  }),
  buildSnkrsCard({
    id: "upcoming-10",
    slug: "zoom-fly-6",
    tab: "upcoming",
    subtitle: "Zoom Fly 6",
    title: "Sail and Green",
    releaseMonth: "3月",
    releaseDay: 8,
  }),
];

export const snkrsInStockCards = snkrsCards.filter((item) => item.tab === "in-stock");
export const snkrsUpcomingCards = snkrsCards.filter((item) => item.tab === "upcoming");
