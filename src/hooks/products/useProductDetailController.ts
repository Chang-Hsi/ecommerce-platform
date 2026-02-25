"use client";

import { useMemo, useState } from "react";

type UseProductDetailControllerParams = {
  mediaCount: number;
};

export function useProductDetailController({ mediaCount }: Readonly<UseProductDetailControllerParams>) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [openAccordionKey, setOpenAccordionKey] = useState<string | null>(null);

  const canGoPrevMedia = activeMediaIndex > 0;
  const canGoNextMedia = activeMediaIndex < mediaCount - 1;

  const activeMediaSafeIndex = useMemo(() => {
    if (mediaCount <= 0) {
      return 0;
    }

    return Math.max(0, Math.min(activeMediaIndex, mediaCount - 1));
  }, [activeMediaIndex, mediaCount]);

  function selectMedia(index: number) {
    setActiveMediaIndex(Math.max(0, Math.min(index, mediaCount - 1)));
  }

  function goPrevMedia() {
    if (!canGoPrevMedia) {
      return;
    }

    setActiveMediaIndex((current) => Math.max(0, current - 1));
  }

  function goNextMedia() {
    if (!canGoNextMedia) {
      return;
    }

    setActiveMediaIndex((current) => Math.min(mediaCount - 1, current + 1));
  }

  function selectSize(sizeValue: string) {
    setSelectedSize(sizeValue);
    setSizeError(null);
  }

  function ensureSizeSelected() {
    if (selectedSize) {
      return selectedSize;
    }

    setSizeError("請先選擇尺寸");
    return null;
  }

  function toggleFavorite() {
    setIsFavorite((current) => !current);
  }

  function toggleAccordion(key: string) {
    setOpenAccordionKey((current) => (current === key ? null : key));
  }

  return {
    activeMediaIndex: activeMediaSafeIndex,
    canGoPrevMedia,
    canGoNextMedia,
    selectedSize,
    sizeError,
    isFavorite,
    openAccordionKey,
    selectMedia,
    goPrevMedia,
    goNextMedia,
    selectSize,
    ensureSizeSelected,
    toggleFavorite,
    toggleAccordion,
  };
}
