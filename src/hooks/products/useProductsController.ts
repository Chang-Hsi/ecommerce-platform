"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchProductsFromApi } from "@/lib/api/products";
import {
  productsContent,
  productsQuickCategoryLinks,
  productsSortOptions,
} from "@/content/products";
import {
  buildQueryString,
  fromSearchParams,
  normalizeSearchParams,
  resolveProductsTitle,
  toApiParams,
  type ProductQueryState,
} from "@/lib/products/query-state";

type MultiValueFilterKey = "gender" | "kids" | "price" | "brand" | "sport" | "fit" | "feature" | "tech" | "colors";

type UseProductsControllerParams = {
  searchParams: Record<string, string | string[] | undefined>;
};

export function useProductsController({ searchParams }: Readonly<UseProductsControllerParams>) {
  const router = useRouter();
  const scrollYRef = useRef(0);
  const tickingRef = useRef(false);
  const sidebarTopRef = useRef(96);

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isCompactHeader, setIsCompactHeader] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [desktopSidebarTop, setDesktopSidebarTop] = useState(96);
  const [products, setProducts] = useState(productsContent);
  const [isProductsLoading, setIsProductsLoading] = useState(true);

  const currentParams = useMemo(() => normalizeSearchParams(searchParams), [searchParams]);
  const queryState = useMemo<ProductQueryState>(() => fromSearchParams(searchParams), [searchParams]);
  const pageTitle = useMemo(() => resolveProductsTitle(currentParams), [currentParams]);
  const apiParams = useMemo(() => toApiParams(queryState), [queryState]);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setIsProductsLoading(true);

      try {
        const payload = await fetchProductsFromApi(apiParams);
        if (!isMounted) {
          return;
        }

        setProducts(payload.products);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("[useProductsController] loadProducts failed", error);
        setProducts(productsContent);
      } finally {
        if (isMounted) {
          setIsProductsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, [apiParams]);

  useEffect(() => {
    scrollYRef.current = window.scrollY;

    function updateFromScroll(currentY: number) {
      setIsCompactHeader((current) => {
        if (current) {
          return currentY > 140;
        }

        return currentY > 200;
      });

      scrollYRef.current = currentY;
    }

    function handleScroll() {
      if (tickingRef.current) {
        return;
      }

      tickingRef.current = true;
      window.requestAnimationFrame(() => {
        updateFromScroll(window.scrollY);
        tickingRef.current = false;
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateFromScroll(window.scrollY);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isMobileFilterOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileFilterOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobileFilterOpen]);

  useEffect(() => {
    let rafId: number | null = null;

    function measureSidebarTop() {
      const headerNode = document.getElementById("products-sticky-header");
      if (!headerNode) {
        return;
      }

      const rect = headerNode.getBoundingClientRect();
      const nextTop = Math.max(16, Math.round(rect.bottom + 12));

      if (Math.abs(nextTop - sidebarTopRef.current) < 1) {
        return;
      }

      sidebarTopRef.current = nextTop;
      setDesktopSidebarTop(nextTop);
    }

    function scheduleMeasure() {
      if (rafId !== null) {
        return;
      }

      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        measureSidebarTop();
      });
    }

    scheduleMeasure();
    window.addEventListener("scroll", scheduleMeasure, { passive: true });
    window.addEventListener("resize", scheduleMeasure);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", scheduleMeasure);
      window.removeEventListener("resize", scheduleMeasure);
    };
  }, []);

  function pushWithUpdates(updates: Record<string, string | null>) {
    const query = buildQueryString(currentParams, updates);
    router.push(`/products?${query}`);
  }

  function handleSortChange(nextSort: string) {
    pushWithUpdates({ sort: nextSort });
  }

  function handleMobileSortChange(nextSort: string) {
    handleSortChange(nextSort);
    setIsMobileFilterOpen(false);
  }

  function toggleMultiValueFilter(key: MultiValueFilterKey, value: string) {
    const currentValues = queryState[key];
    const nextValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    pushWithUpdates({ [key]: nextValues.length > 0 ? nextValues.join(",") : null });
  }

  function toggleFilter(key: Exclude<MultiValueFilterKey, "colors">, option: string) {
    toggleMultiValueFilter(key, option);
  }

  function toggleColor(colorLabel: string) {
    toggleMultiValueFilter("colors", colorLabel);
  }

  function buildCategoryHref(category: string) {
    const query = buildQueryString(currentParams, { category });
    return `/products?${query}`;
  }

  const mobileCategoryLinks = productsQuickCategoryLinks.map((item) => ({
    ...item,
    href: buildCategoryHref(item.category),
  }));

  return {
    products,
    productsSortOptions,
    productsQuickCategoryLinks,
    mobileCategoryLinks,
    pageTitle,
    queryState,
    apiParams,
    isProductsLoading,
    isSidebarVisible,
    isCompactHeader,
    isMobileFilterOpen,
    desktopSidebarTop,
    setIsSidebarVisible,
    setIsMobileFilterOpen,
    handleSortChange,
    handleMobileSortChange,
    toggleFilter,
    toggleColor,
    buildCategoryHref,
  };
}
