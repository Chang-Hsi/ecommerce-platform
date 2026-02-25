export type HomeHeroContent = {
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

export type HomeFeaturedItem = {
  title: string;
  href: string;
  imageSrc: string;
};

export type HomeSportItem = {
  name: string;
  href: string;
  imageSrc: string;
};

export type HomeSpotlightItem = {
  name: string;
  href: string;
  imageSrc: string;
};

export type HomeContent = {
  hero: HomeHeroContent;
  featured: HomeFeaturedItem[];
  sports: HomeSportItem[];
  spotlight: {
    title: string;
    subtitle: string;
    items: HomeSpotlightItem[];
  };
};

export const homeContent: HomeContent = {
  hero: {
    title: "AIR MAX 95",
    subtitle: "原版 Neon 配色將於 3 月 5 日重磅回歸，立即設定提醒。",
    videoSrc: "/media/home/homeBanner.mov",
    posterSrc:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=2000&q=80",
    primaryCta: {
      label: "通知我",
      href: "/join",
    },
    secondaryCta: {
      label: "選購 Air Max",
      href: "/products?collection=air-max&page=1",
    },
  },
  featured: [
    {
      title: "日常跑步訓練",
      href: "/products?sport=running&page=1",
      imageSrc:
        "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=1400&q=80",
    },
    {
      title: "城市街頭穿搭",
      href: "/products?category=shoes&sport=lifestyle&page=1",
      imageSrc:
        "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1400&q=80",
    },
    {
      title: "力量與訓練",
      href: "/products?sport=training&page=1",
      imageSrc:
        "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1400&q=80",
    },
    {
      title: "場上競技系列",
      href: "/products?sport=basketball&page=1",
      imageSrc:
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1400&q=80",
    },
  ],
  sports: [
    {
      name: "跑步",
      href: "/products?sport=running&page=1",
      imageSrc:
        "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "足球",
      href: "/products?sport=football&page=1",
      imageSrc:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "籃球",
      href: "/products?sport=basketball&page=1",
      imageSrc:
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "網球",
      href: "/products?sport=tennis&page=1",
      imageSrc:
        "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "高爾夫",
      href: "/products?sport=golf&page=1",
      imageSrc:
        "https://images.unsplash.com/photo-1535132011086-b8818f016104?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "健身與訓練",
      href: "/products?sport=training&page=1",
      imageSrc:
        "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "瑜伽",
      href: "/products?sport=yoga&page=1",
      imageSrc:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "滑板",
      href: "/products?sport=skateboarding&page=1",
      imageSrc:
        "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=1200&q=80",
    },
  ],
  spotlight: {
    title: "矚目焦點",
    subtitle: "經典版型搭配尖端創新技術，從根本開始打好基礎，精益求精。",
    items: [
      { name: "Air Jordan 1 低筒鞋", href: "/products?collection=air-jordan-1&page=1", imageSrc: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80" },
      { name: "Dunk", href: "/products?collection=dunk&page=1", imageSrc: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=500&q=80" },
      { name: "Air Force 1", href: "/products?collection=air-force-1&page=1", imageSrc: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&q=80" },
      { name: "Vomero Plus", href: "/products?collection=vomero&page=1", imageSrc: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=500&q=80" },
      { name: "Pegasus Premium", href: "/products?collection=pegasus&page=1", imageSrc: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=500&q=80" },
      { name: "24.7 系列", href: "/products?collection=24-7&page=1", imageSrc: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80" },
      { name: "網球服飾", href: "/products?sport=tennis&page=1", imageSrc: "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=500&q=80" },
      { name: "Vaporfly", href: "/products?collection=vaporfly&page=1", imageSrc: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=500&q=80" },
      { name: "Sabrina", href: "/products?collection=sabrina&page=1", imageSrc: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=500&q=80" },
      { name: "Cortez", href: "/products?collection=cortez&page=1", imageSrc: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=500&q=80" },
      { name: "Metcon 10", href: "/products?collection=metcon&page=1", imageSrc: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=500&q=80" },
      { name: "NBA 球衣", href: "/products?category=jerseys&page=1", imageSrc: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80" },
      { name: "Shox", href: "/products?collection=shox&page=1", imageSrc: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=500&q=80" },
      { name: "Air Max DN", href: "/products?collection=air-max&page=1", imageSrc: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&q=80" },
      { name: "Zoomfly 6", href: "/products?collection=zoomfly&page=1", imageSrc: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=500&q=80" },
      { name: "圖樣 T 恤", href: "/products?category=tops&page=1", imageSrc: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80" },
    ],
  },
};
