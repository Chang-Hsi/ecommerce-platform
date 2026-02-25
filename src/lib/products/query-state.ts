import { headerNavSections } from "@/content/header-menu";

export type ProductQueryState = {
  category: string | null;
  sort: "popular" | "newest" | "price_desc" | "price_asc";
  page: number;
  q: string | null;
  gender: string[];
  kids: string[];
  price: string[];
  brand: string[];
  sport: string[];
  fit: string[];
  feature: string[];
  tech: string[];
  colors: string[];
};

function parseMultiValue(raw: Record<string, string | string[] | undefined>, key: string): string[] {
  const value = raw[key];

  if (typeof value === "string") {
    if (value.trim() === "") {
      return [];
    }

    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => item.split(","))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export function readQueryValue(raw: Record<string, string | string[] | undefined>, key: string): string | null {
  const value = raw[key];
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value) && value.length > 0) {
    return value[0] ?? null;
  }

  return null;
}

export function normalizeSearchParams(raw: Record<string, string | string[] | undefined>): URLSearchParams {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") {
      params.set(key, value);
    } else if (Array.isArray(value) && value[0]) {
      params.set(key, value[0]);
    }
  }

  return params;
}

export function buildQueryString(base: URLSearchParams, updates: Record<string, string | null>): string {
  const next = new URLSearchParams(base.toString());

  for (const [key, value] of Object.entries(updates)) {
    if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
  }

  if (!Object.prototype.hasOwnProperty.call(updates, "page")) {
    next.set("page", "1");
  }

  return next.toString();
}

export function resolveProductsTitle(currentParams: URLSearchParams): string {
  const candidateLinks = headerNavSections.flatMap((section) => {
    const main = [{ label: section.label, href: section.href }];
    const columnLinks = section.columns.flatMap((column) => column.links);
    return [...main, ...columnLinks];
  });

  let bestMatch: { label: string; score: number } | null = null;

  for (const candidate of candidateLinks) {
    if (!candidate.href.startsWith("/products?")) {
      continue;
    }

    const linkParams = new URLSearchParams(candidate.href.split("?")[1] ?? "");

    let allMatched = true;
    let score = 0;

    for (const [key, value] of linkParams.entries()) {
      if (key === "page") {
        continue;
      }

      if (currentParams.get(key) !== value) {
        allMatched = false;
        break;
      }

      score += 1;
    }

    if (allMatched && score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { label: candidate.label, score };
    }
  }

  if (bestMatch) {
    return bestMatch.label;
  }

  const q = currentParams.get("q");
  if (q) {
    return `搜尋：${q}`;
  }

  return "商品總覽";
}

export function fromSearchParams(raw: Record<string, string | string[] | undefined>): ProductQueryState {
  const sort = readQueryValue(raw, "sort");
  const pageRaw = Number(readQueryValue(raw, "page") ?? "1");

  return {
    category: readQueryValue(raw, "category"),
    sort: sort === "newest" || sort === "price_desc" || sort === "price_asc" ? sort : "popular",
    page: Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1,
    q: readQueryValue(raw, "q"),
    gender: parseMultiValue(raw, "gender"),
    kids: parseMultiValue(raw, "kids"),
    price: parseMultiValue(raw, "price"),
    brand: parseMultiValue(raw, "brand"),
    sport: parseMultiValue(raw, "sport"),
    fit: parseMultiValue(raw, "fit"),
    feature: parseMultiValue(raw, "feature"),
    tech: parseMultiValue(raw, "tech"),
    colors: parseMultiValue(raw, "colors"),
  };
}

export function toApiParams(queryState: ProductQueryState) {
  return {
    category: queryState.category,
    sort: queryState.sort,
    page: queryState.page,
    q: queryState.q,
    gender: queryState.gender,
    kids: queryState.kids,
    price: queryState.price,
    brand: queryState.brand,
    sport: queryState.sport,
    fit: queryState.fit,
    feature: queryState.feature,
    tech: queryState.tech,
    colors: queryState.colors,
  };
}
