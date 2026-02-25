export type HeaderMenuLink = {
  label: string;
  href: string;
};

export type HeaderMenuColumn = {
  title: string;
  links: HeaderMenuLink[];
};

export type HeaderNavSection = {
  id: string;
  label: string;
  href: string;
  columns: HeaderMenuColumn[];
};

export const utilityLinks: HeaderMenuLink[] = [
  { label: "協助", href: "/help" },
  { label: "加入", href: "/join" },
  { label: "登入", href: "/login" },
];

export const hotSearchKeywords = [
  "球場造型",
  "春季情人節系列",
  "air force 1",
  "kobe",
  "dunk",
  "ja3",
  "籃球鞋",
  "jordan",
];

export const headerNavSections: HeaderNavSection[] = [
  {
    id: "new-featured",
    label: "新品和精選",
    href: "/products?group=new-featured&page=1",
    columns: [
      {
        title: "新品和精選",
        links: [
          { label: "即將發售", href: "/products?group=upcoming&page=1" },
          { label: "新品發售", href: "/products?group=new-release&page=1" },
          { label: "熱銷商品", href: "/products?sort=popular&page=1" },
          { label: "SNKRS 發售行事曆", href: "/snkrs" },
          { label: "客製工坊 專屬訂製", href: "/products?collection=custom-studio&page=1" },
          { label: "Jordan", href: "/products?collection=jordan&page=1" },
        ],
      },
      {
        title: "熱門",
        links: [
          { label: "Just Do the Work", href: "/products?group=just-do-the-work&page=1" },
          { label: "24.7 系列", href: "/products?collection=24-7&page=1" },
          { label: "復古跑步風格", href: "/products?sport=running&style=retro&page=1" },
          { label: "搜尋跑鞋", href: "/products?sport=running&category=shoes&page=1" },
          { label: "運動心流", href: "/products?group=movement-mind&page=1" },
        ],
      },
      {
        title: "經典",
        links: [
          { label: "Air Force 1", href: "/products?collection=air-force-1&page=1" },
          { label: "Air Jordan 1", href: "/products?collection=air-jordan-1&page=1" },
          { label: "Air Max", href: "/products?collection=air-max&page=1" },
          { label: "Dunk", href: "/products?collection=dunk&page=1" },
          { label: "Pegasus", href: "/products?collection=pegasus&page=1" },
          { label: "Vomero", href: "/products?collection=vomero&page=1" },
        ],
      },
      {
        title: "依運動項目選購",
        links: [
          { label: "跑步", href: "/products?sport=running&page=1" },
          { label: "籃球", href: "/products?sport=basketball&page=1" },
          { label: "足球", href: "/products?sport=football&page=1" },
          { label: "高爾夫", href: "/products?sport=golf&page=1" },
          { label: "網球與匹克球", href: "/products?sport=tennis&page=1" },
          { label: "健身與訓練", href: "/products?sport=training&page=1" },
          { label: "瑜伽", href: "/products?sport=yoga&page=1" },
          { label: "滑板", href: "/products?sport=skateboarding&page=1" },
        ],
      },
    ],
  },
  {
    id: "men",
    label: "男款",
    href: "/products?gender=men&page=1",
    columns: [
      {
        title: "精選",
        links: [
          { label: "新品發售", href: "/products?gender=men&group=new-release&page=1" },
          { label: "暢銷商品", href: "/products?gender=men&sort=popular&page=1" },
          { label: "選購所有特惠商品", href: "/products?gender=men&sale=true&page=1" },
          { label: "全天候裝備", href: "/products?gender=men&group=all-weather&page=1" },
        ],
      },
      {
        title: "鞋款",
        links: [
          { label: "所有鞋款", href: "/products?gender=men&category=shoes&page=1" },
          { label: "運動生活", href: "/products?gender=men&category=shoes&sport=lifestyle&page=1" },
          { label: "Jordan", href: "/products?gender=men&collection=jordan&page=1" },
          { label: "跑步", href: "/products?gender=men&sport=running&category=shoes&page=1" },
          { label: "足球", href: "/products?gender=men&sport=football&category=shoes&page=1" },
          { label: "籃球", href: "/products?gender=men&sport=basketball&category=shoes&page=1" },
          { label: "健身與訓練", href: "/products?gender=men&sport=training&category=shoes&page=1" },
        ],
      },
      {
        title: "服飾",
        links: [
          { label: "所有服飾", href: "/products?gender=men&category=tops&page=1" },
          { label: "上衣與 T 恤", href: "/products?gender=men&category=tops&page=1" },
          { label: "長褲與內搭褲", href: "/products?gender=men&category=bottoms&page=1" },
          { label: "連帽上衣與運動衫", href: "/products?gender=men&category=hoodies&page=1" },
          { label: "外套與背心", href: "/products?gender=men&category=jackets&page=1" },
          { label: "球衣與組合", href: "/products?gender=men&category=jerseys&page=1" },
        ],
      },
      {
        title: "依運動項目選購",
        links: [
          { label: "跑步", href: "/products?gender=men&sport=running&page=1" },
          { label: "籃球", href: "/products?gender=men&sport=basketball&page=1" },
          { label: "足球", href: "/products?gender=men&sport=football&page=1" },
          { label: "高爾夫", href: "/products?gender=men&sport=golf&page=1" },
          { label: "網球與匹克球", href: "/products?gender=men&sport=tennis&page=1" },
          { label: "健身與訓練", href: "/products?gender=men&sport=training&page=1" },
        ],
      },
      {
        title: "配件與裝備",
        links: [
          { label: "所有配件與裝備", href: "/products?gender=men&category=accessories&page=1" },
          { label: "手提袋與背包", href: "/products?gender=men&category=bags&page=1" },
          { label: "襪子", href: "/products?gender=men&category=socks&page=1" },
          { label: "帽款與頭飾", href: "/products?gender=men&category=hats&page=1" },
        ],
      },
    ],
  },
  {
    id: "women",
    label: "女款",
    href: "/products?gender=women&page=1",
    columns: [
      {
        title: "精選",
        links: [
          { label: "新品發售", href: "/products?gender=women&group=new-release&page=1" },
          { label: "暢銷商品", href: "/products?gender=women&sort=popular&page=1" },
          { label: "選購所有特惠商品", href: "/products?gender=women&sale=true&page=1" },
          { label: "全天候裝備", href: "/products?gender=women&group=all-weather&page=1" },
        ],
      },
      {
        title: "鞋款",
        links: [
          { label: "所有鞋款", href: "/products?gender=women&category=shoes&page=1" },
          { label: "運動生活", href: "/products?gender=women&category=shoes&sport=lifestyle&page=1" },
          { label: "Jordan", href: "/products?gender=women&collection=jordan&page=1" },
          { label: "跑步", href: "/products?gender=women&sport=running&category=shoes&page=1" },
          { label: "健身與訓練", href: "/products?gender=women&sport=training&category=shoes&page=1" },
        ],
      },
      {
        title: "服飾",
        links: [
          { label: "所有服飾", href: "/products?gender=women&category=tops&page=1" },
          { label: "機能訓練必備單品", href: "/products?gender=women&group=training-essentials&page=1" },
          { label: "上衣與 T 恤", href: "/products?gender=women&category=tops&page=1" },
          { label: "運動內衣", href: "/products?gender=women&category=bras&page=1" },
          { label: "長褲與內搭褲", href: "/products?gender=women&category=leggings&page=1" },
          { label: "短褲", href: "/products?gender=women&category=shorts&page=1" },
        ],
      },
      {
        title: "依運動項目選購",
        links: [
          { label: "瑜伽", href: "/products?gender=women&sport=yoga&page=1" },
          { label: "跑步", href: "/products?gender=women&sport=running&page=1" },
          { label: "健身與訓練", href: "/products?gender=women&sport=training&page=1" },
          { label: "籃球", href: "/products?gender=women&sport=basketball&page=1" },
        ],
      },
      {
        title: "配件與裝備",
        links: [
          { label: "配件與裝備", href: "/products?gender=women&category=accessories&page=1" },
          { label: "手提袋與背包", href: "/products?gender=women&category=bags&page=1" },
          { label: "襪子", href: "/products?gender=women&category=socks&page=1" },
          { label: "帽款與頭飾", href: "/products?gender=women&category=hats&page=1" },
        ],
      },
    ],
  },
  {
    id: "kids",
    label: "兒童款",
    href: "/products?gender=kids&page=1",
    columns: [
      {
        title: "精選",
        links: [
          { label: "新品發售", href: "/products?gender=kids&group=new-release&page=1" },
          { label: "暢銷商品", href: "/products?gender=kids&sort=popular&page=1" },
          { label: "開學造型", href: "/products?gender=kids&group=school-style&page=1" },
          { label: "運動裝備", href: "/products?gender=kids&group=sport-gear&page=1" },
        ],
      },
      {
        title: "鞋款",
        links: [
          { label: "所有鞋款", href: "/products?gender=kids&category=shoes&page=1" },
          { label: "運動生活", href: "/products?gender=kids&category=shoes&sport=lifestyle&page=1" },
          { label: "足球", href: "/products?gender=kids&sport=football&page=1" },
          { label: "跑步", href: "/products?gender=kids&sport=running&page=1" },
          { label: "籃球", href: "/products?gender=kids&sport=basketball&page=1" },
        ],
      },
      {
        title: "服飾",
        links: [
          { label: "所有服飾", href: "/products?gender=kids&category=tops&page=1" },
          { label: "上衣與 T 恤", href: "/products?gender=kids&category=tops&page=1" },
          { label: "運動內衣", href: "/products?gender=kids&category=sportswear&page=1" },
          { label: "連帽上衣與運動衫", href: "/products?gender=kids&category=hoodies&page=1" },
          { label: "長褲與內搭褲", href: "/products?gender=kids&category=bottoms&page=1" },
        ],
      },
      {
        title: "依照年齡分類",
        links: [
          { label: "大童 (7-14 歲)", href: "/products?gender=kids&age=big-kids&page=1" },
          { label: "小童 (4-7 歲)", href: "/products?gender=kids&age=little-kids&page=1" },
          { label: "嬰幼兒 (0-4 歲)", href: "/products?gender=kids&age=baby-toddler&page=1" },
        ],
      },
    ],
  },
  {
    id: "sale",
    label: "特惠商品",
    href: "/products?sale=true&page=1",
    columns: [
      {
        title: "特惠商品",
        links: [
          { label: "選購所有特惠商品", href: "/products?sale=true&page=1" },
          { label: "熱銷商品", href: "/products?sale=true&sort=popular&page=1" },
          { label: "最後機會", href: "/products?sale=true&group=last-chance&page=1" },
        ],
      },
      {
        title: "男款特惠商品",
        links: [
          { label: "鞋款", href: "/products?sale=true&gender=men&category=shoes&page=1" },
          { label: "服飾", href: "/products?sale=true&gender=men&category=tops&page=1" },
          { label: "配件與裝備", href: "/products?sale=true&gender=men&category=accessories&page=1" },
        ],
      },
      {
        title: "女款特惠商品",
        links: [
          { label: "鞋款", href: "/products?sale=true&gender=women&category=shoes&page=1" },
          { label: "服飾", href: "/products?sale=true&gender=women&category=tops&page=1" },
          { label: "配件與裝備", href: "/products?sale=true&gender=women&category=accessories&page=1" },
        ],
      },
      {
        title: "兒童款特惠商品",
        links: [
          { label: "鞋款", href: "/products?sale=true&gender=kids&category=shoes&page=1" },
          { label: "服飾", href: "/products?sale=true&gender=kids&category=tops&page=1" },
          { label: "配件與裝備", href: "/products?sale=true&gender=kids&category=accessories&page=1" },
        ],
      },
      {
        title: "依運動項目選購",
        links: [
          { label: "足球", href: "/products?sale=true&sport=football&page=1" },
          { label: "跑步", href: "/products?sale=true&sport=running&page=1" },
          { label: "籃球", href: "/products?sale=true&sport=basketball&page=1" },
          { label: "健身與訓練", href: "/products?sale=true&sport=training&page=1" },
        ],
      },
    ],
  },
  {
    id: "snkrs",
    label: "SNKRS",
    href: "/snkrs",
    columns: [
      {
        title: "SNKRS",
        links: [
          { label: "最高可享 7 折優惠", href: "/snkrs" },
          { label: "選購我們所有最新優惠商品", href: "/products?sale=true&page=1" },
        ],
      },
    ],
  },
];
