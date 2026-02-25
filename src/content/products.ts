export type ProductImageRatio = "square" | "portrait";

export type ProductGenderOption = "男子" | "女子" | "中性";
export type ProductKidsOption = "男童" | "女童款";
export type ProductPriceOption = "低於 $1,500" | "$1,500 - $3,000" | "$3,000 - $5,000" | "$5,000 以上";
export type ProductBrandOption =
  | "Sportswear"
  | "Jordan"
  | "NikeLab"
  | "ACG"
  | "NOCTA"
  | "Converse"
  | "SB"
  | "Golf";
export type ProductSportOption =
  | "運動生活"
  | "跑步"
  | "訓練與健身"
  | "籃球"
  | "美式足球"
  | "英式足球"
  | "高爾夫"
  | "滑板"
  | "網球"
  | "田徑"
  | "健走"
  | "戶外活動";
export type ProductFitOption = "潮濕天候" | "寬楦" | "窄楦" | "日常通勤";
export type ProductFeatureOption = "4 向伸縮力" | "抽繩設計" | "排汗快乾" | "反光細節";
export type ProductTechOption = "Air" | "Zoom Air" | "React" | "GORE-TEX";
export type ProductColorLabel =
  | "紫色"
  | "黑色"
  | "紅色"
  | "橘色"
  | "藍色"
  | "白色"
  | "棕色"
  | "綠色"
  | "黃色"
  | "多種顏色"
  | "灰色"
  | "粉紅色";

export type ProductSortOption = {
  label: string;
  value: "popular" | "newest" | "price_desc" | "price_asc";
};

export type ProductQuickCategoryLink = {
  label: string;
  category: "shoes" | "tops" | "hoodies" | "bottoms" | "sportswear";
};

export type ProductColorOption = {
  label: ProductColorLabel;
  swatchClass: string;
  checkColorClass?: string;
};

export type ProductFilterAttributes = {
  category: ProductQuickCategoryLink["category"];
  gender: ProductGenderOption[];
  audience: "adult" | "kids";
  kidsSegments: ProductKidsOption[];
  priceRange: ProductPriceOption;
  colors: ProductColorLabel[];
  brand: ProductBrandOption;
  sports: ProductSportOption[];
  fit: ProductFitOption[];
  features: ProductFeatureOption[];
  tech: ProductTechOption[];
};

export type ProductCatalogItem = {
  slug: string;
  name: string;
  subtitle: string;
  badge: string;
  price: number;
  imageSrc: string;
  imageRatio: ProductImageRatio;
  filterAttributes: ProductFilterAttributes;
};

export const productsSortOptions: ProductSortOption[] = [
  { label: "精選", value: "popular" },
  { label: "最新", value: "newest" },
  { label: "價格：由高到低", value: "price_desc" },
  { label: "價格：由低到高", value: "price_asc" },
];

export const productsQuickCategoryLinks: ProductQuickCategoryLink[] = [
  { label: "鞋款", category: "shoes" },
  { label: "上衣及 T 恤", category: "tops" },
  { label: "連帽上衣及套頭上衣", category: "hoodies" },
  { label: "運動褲與緊身褲", category: "bottoms" },
  { label: "運動服", category: "sportswear" },
];

export const productsFilterOptions = {
  gender: ["男子", "女子", "中性"] as ProductGenderOption[],
  kids: ["男童", "女童款"] as ProductKidsOption[],
  price: ["低於 $1,500", "$1,500 - $3,000", "$3,000 - $5,000", "$5,000 以上"] as ProductPriceOption[],
  brand: ["Sportswear", "Jordan", "NikeLab", "ACG", "NOCTA", "Converse", "SB", "Golf"] as ProductBrandOption[],
  sport: [
    "運動生活",
    "跑步",
    "訓練與健身",
    "籃球",
    "美式足球",
    "英式足球",
    "高爾夫",
    "滑板",
    "網球",
    "田徑",
    "健走",
    "戶外活動",
  ] as ProductSportOption[],
  fit: ["潮濕天候", "寬楦", "窄楦", "日常通勤"] as ProductFitOption[],
  feature: ["4 向伸縮力", "抽繩設計", "排汗快乾", "反光細節"] as ProductFeatureOption[],
  tech: ["Air", "Zoom Air", "React", "GORE-TEX"] as ProductTechOption[],
};

export const productsColorOptions: ProductColorOption[] = [
  { label: "紫色", swatchClass: "bg-purple-600" },
  { label: "黑色", swatchClass: "bg-black" },
  { label: "紅色", swatchClass: "bg-red-500" },
  { label: "橘色", swatchClass: "bg-orange-500" },
  { label: "藍色", swatchClass: "bg-sky-500" },
  { label: "白色", swatchClass: "border border-zinc-300 bg-white", checkColorClass: "text-zinc-700" },
  { label: "棕色", swatchClass: "bg-[#8b6242]" },
  { label: "綠色", swatchClass: "bg-lime-500" },
  { label: "黃色", swatchClass: "bg-yellow-400", checkColorClass: "text-zinc-700" },
  {
    label: "多種顏色",
    swatchClass:
      "bg-[linear-gradient(45deg,#111_0%,#111_25%,#fff_25%,#fff_50%,#111_50%,#111_75%,#fff_75%,#fff_100%)] bg-[length:12px_12px]",
  },
  { label: "灰色", swatchClass: "bg-zinc-400", checkColorClass: "text-zinc-700" },
  { label: "粉紅色", swatchClass: "bg-rose-400" },
];

export const productsContent: ProductCatalogItem[] = [
  {
    slug: "air-max-95-og",
    name: "Nike Air Max 95 OG",
    subtitle: "男鞋",
    badge: "即將推出",
    price: 5400,
    imageSrc: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    imageRatio: "portrait",
    filterAttributes: {
      category: "shoes",
      gender: ["男子"],
      audience: "adult",
      kidsSegments: [],
      priceRange: "$5,000 以上",
      colors: ["紅色", "黑色", "白色"],
      brand: "Sportswear",
      sports: ["跑步", "運動生活"],
      fit: ["日常通勤", "窄楦"],
      features: ["反光細節", "排汗快乾"],
      tech: ["Air"],
    },
  },
  {
    slug: "air-max-95-big-bubble",
    name: "Nike Air Max 95 Big Bubble",
    subtitle: "女鞋",
    badge: "即將推出",
    price: 5400,
    imageSrc: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80",
    imageRatio: "square",
    filterAttributes: {
      category: "shoes",
      gender: ["女子"],
      audience: "adult",
      kidsSegments: [],
      priceRange: "$5,000 以上",
      colors: ["黑色", "白色", "灰色"],
      brand: "Sportswear",
      sports: ["運動生活"],
      fit: ["日常通勤"],
      features: ["反光細節"],
      tech: ["Air"],
    },
  },
  {
    slug: "nike-air-max-95-kids",
    name: "Nike Air Max '95",
    subtitle: "兒童款",
    badge: "即將推出",
    price: 3500,
    imageSrc: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80",
    imageRatio: "portrait",
    filterAttributes: {
      category: "shoes",
      gender: ["中性"],
      audience: "kids",
      kidsSegments: ["男童", "女童款"],
      priceRange: "$3,000 - $5,000",
      colors: ["白色", "橘色"],
      brand: "Sportswear",
      sports: ["運動生活"],
      fit: ["日常通勤", "寬楦"],
      features: ["排汗快乾"],
      tech: ["Air"],
    },
  },
  {
    slug: "pegasus-premium",
    name: "Pegasus Premium",
    subtitle: "男鞋",
    badge: "熱門",
    price: 4800,
    imageSrc: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=900&q=80",
    imageRatio: "square",
    filterAttributes: {
      category: "shoes",
      gender: ["男子"],
      audience: "adult",
      kidsSegments: [],
      priceRange: "$3,000 - $5,000",
      colors: ["白色", "灰色"],
      brand: "Sportswear",
      sports: ["跑步"],
      fit: ["寬楦"],
      features: ["排汗快乾", "反光細節"],
      tech: ["Zoom Air", "React"],
    },
  },
  {
    slug: "zoom-fly-6",
    name: "Zoom Fly 6",
    subtitle: "女鞋",
    badge: "新品",
    price: 4300,
    imageSrc: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80",
    imageRatio: "portrait",
    filterAttributes: {
      category: "shoes",
      gender: ["女子"],
      audience: "adult",
      kidsSegments: [],
      priceRange: "$3,000 - $5,000",
      colors: ["粉紅色", "藍色"],
      brand: "NOCTA",
      sports: ["跑步"],
      fit: ["窄楦"],
      features: ["反光細節"],
      tech: ["Zoom Air", "React"],
    },
  },
  {
    slug: "dunk-low-retro",
    name: "Dunk Low Retro",
    subtitle: "中性",
    badge: "即將推出",
    price: 3400,
    imageSrc: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80",
    imageRatio: "square",
    filterAttributes: {
      category: "shoes",
      gender: ["中性"],
      audience: "adult",
      kidsSegments: [],
      priceRange: "$3,000 - $5,000",
      colors: ["紅色", "黑色"],
      brand: "Jordan",
      sports: ["籃球", "運動生活"],
      fit: ["日常通勤"],
      features: ["抽繩設計"],
      tech: ["Air"],
    },
  },
  {
    slug: "vomero-plus",
    name: "Vomero Plus",
    subtitle: "跑步",
    badge: "新品",
    price: 4600,
    imageSrc: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=900&q=80",
    imageRatio: "portrait",
    filterAttributes: {
      category: "shoes",
      gender: ["中性"],
      audience: "adult",
      kidsSegments: [],
      priceRange: "$3,000 - $5,000",
      colors: ["藍色", "黃色"],
      brand: "Sportswear",
      sports: ["跑步", "健走"],
      fit: ["寬楦"],
      features: ["排汗快乾"],
      tech: ["Zoom Air", "React"],
    },
  },
  {
    slug: "metcon-10",
    name: "Metcon 10",
    subtitle: "訓練",
    badge: "熱門",
    price: 3800,
    imageSrc: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=900&q=80",
    imageRatio: "square",
    filterAttributes: {
      category: "shoes",
      gender: ["中性"],
      audience: "adult",
      kidsSegments: [],
      priceRange: "$3,000 - $5,000",
      colors: ["黑色", "灰色"],
      brand: "ACG",
      sports: ["訓練與健身"],
      fit: ["寬楦"],
      features: ["4 向伸縮力"],
      tech: ["React"],
    },
  },
  {
    slug: "air-force-1-07",
    name: "Air Force 1 '07",
    subtitle: "男鞋",
    badge: "經典",
    price: 3600,
    imageSrc: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80",
    imageRatio: "portrait",
    filterAttributes: {
      category: "shoes",
      gender: ["男子"],
      audience: "adult",
      kidsSegments: [],
      priceRange: "$3,000 - $5,000",
      colors: ["白色", "黑色"],
      brand: "Sportswear",
      sports: ["運動生活"],
      fit: ["日常通勤"],
      features: ["抽繩設計"],
      tech: ["Air"],
    },
  },
  {
    slug: "sabrina-2",
    name: "Sabrina 2",
    subtitle: "籃球",
    badge: "新品",
    price: 3900,
    imageSrc: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=900&q=80",
    imageRatio: "square",
    filterAttributes: {
      category: "shoes",
      gender: ["女子", "中性"],
      audience: "adult",
      kidsSegments: [],
      priceRange: "$3,000 - $5,000",
      colors: ["粉紅色", "黑色"],
      brand: "Jordan",
      sports: ["籃球"],
      fit: ["窄楦"],
      features: ["反光細節"],
      tech: ["Zoom Air"],
    },
  },
  {
    slug: "air-jordan-1-low",
    name: "Air Jordan 1 Low",
    subtitle: "中性",
    badge: "熱門",
    price: 4200,
    imageSrc: "https://images.unsplash.com/photo-1579446650032-86f4f5d5d7d8?auto=format&fit=crop&w=900&q=80",
    imageRatio: "portrait",
    filterAttributes: {
      category: "shoes",
      gender: ["中性"],
      audience: "adult",
      kidsSegments: [],
      priceRange: "$3,000 - $5,000",
      colors: ["紅色", "黑色", "白色"],
      brand: "Jordan",
      sports: ["籃球", "運動生活"],
      fit: ["日常通勤"],
      features: ["抽繩設計"],
      tech: ["Air"],
    },
  },
  {
    slug: "cortez-leather",
    name: "Cortez Leather",
    subtitle: "女鞋",
    badge: "經典",
    price: 3200,
    imageSrc: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=900&q=80",
    imageRatio: "square",
    filterAttributes: {
      category: "shoes",
      gender: ["女子"],
      audience: "adult",
      kidsSegments: [],
      priceRange: "$3,000 - $5,000",
      colors: ["白色", "棕色"],
      brand: "Converse",
      sports: ["運動生活"],
      fit: ["日常通勤"],
      features: ["抽繩設計"],
      tech: ["React"],
    },
  },
];
