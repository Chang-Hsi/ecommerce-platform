"use client";

import { CheckIcon } from "@heroicons/react/20/solid";
import { useMemo, useState } from "react";
import { FilterGroup } from "@/components/products/FilterGroup";
import { productsColorOptions, productsFilterOptions } from "@/content/products";

export type CheckboxFilterKey = "gender" | "kids" | "price" | "brand" | "sport" | "fit" | "feature" | "tech";

type CheckboxGroupBlockProps = {
  title: string;
  options: string[];
  selectedValues: string[];
  onToggleOption: (option: string) => void;
  textSizeClass?: string;
  defaultOpen?: boolean;
  collapsedCount?: number;
};

type ProductsFiltersPanelProps = {
  textSizeClass?: string;
  selectedFilters: Record<CheckboxFilterKey, string[]>;
  onToggleFilter: (key: CheckboxFilterKey, option: string) => void;
  selectedColors: string[];
  onToggleColor: (colorLabel: string) => void;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function CheckboxGroupBlock({
  title,
  options,
  selectedValues,
  onToggleOption,
  textSizeClass = "text-base",
  defaultOpen = false,
  collapsedCount,
}: Readonly<CheckboxGroupBlockProps>) {
  const [expanded, setExpanded] = useState(false);
  const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);
  const canCollapse = Boolean(collapsedCount && options.length > collapsedCount);
  const alwaysVisibleOptions = canCollapse ? options.slice(0, collapsedCount) : options;
  const collapsibleOptions = canCollapse ? options.slice(collapsedCount) : [];

  function renderCheckbox(option: string) {
    return (
      <label key={option} className={cn("flex items-center gap-2 text-zinc-800", textSizeClass)}>
        <input
          type="checkbox"
          checked={selectedSet.has(option)}
          onChange={() => onToggleOption(option)}
          className="h-5 w-5 rounded border-zinc-400 text-zinc-900 focus:ring-zinc-900"
        />
        <span>{option}</span>
      </label>
    );
  }

  return (
    <FilterGroup title={title} defaultOpen={defaultOpen}>
      <div className="space-y-4">
        {alwaysVisibleOptions.map((option) => renderCheckbox(option))}
        {canCollapse ? (
          <div
            className={cn(
              "grid transition-all duration-300",
              expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="overflow-hidden">
              <div className="space-y-4 pt-1">{collapsibleOptions.map((option) => renderCheckbox(option))}</div>
            </div>
          </div>
        ) : null}
        {canCollapse ? (
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            className={cn("pt-1 text-zinc-700", textSizeClass)}
          >
            {expanded ? "- 精簡" : "+ 更多"}
          </button>
        ) : null}
      </div>
    </FilterGroup>
  );
}

export function ProductsFiltersPanel({
  textSizeClass = "text-base",
  selectedFilters,
  onToggleFilter,
  selectedColors,
  onToggleColor,
}: Readonly<ProductsFiltersPanelProps>) {
  const selectedColorSet = useMemo(() => new Set(selectedColors), [selectedColors]);

  return (
    <>
      <CheckboxGroupBlock
        title="性別"
        options={productsFilterOptions.gender}
        selectedValues={selectedFilters.gender}
        onToggleOption={(option) => onToggleFilter("gender", option)}
        textSizeClass={textSizeClass}
      />
      <CheckboxGroupBlock
        title="兒童款"
        options={productsFilterOptions.kids}
        selectedValues={selectedFilters.kids}
        onToggleOption={(option) => onToggleFilter("kids", option)}
        textSizeClass={textSizeClass}
      />
      <CheckboxGroupBlock
        title="依價格選購"
        options={productsFilterOptions.price}
        selectedValues={selectedFilters.price}
        onToggleOption={(option) => onToggleFilter("price", option)}
        textSizeClass={textSizeClass}
      />

      <FilterGroup title={selectedColors.length > 0 ? `顏色 (${selectedColors.length})` : "顏色"}>
        <div className="grid grid-cols-3 gap-x-3 gap-y-4">
          {productsColorOptions.map((color) => (
            <button
              key={color.label}
              type="button"
              onClick={() => onToggleColor(color.label)}
              className="flex min-w-0 flex-col items-center gap-1 text-center"
              aria-pressed={selectedColorSet.has(color.label)}
            >
              <span
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-full",
                  color.swatchClass,
                )}
              >
                {selectedColorSet.has(color.label) ? (
                  <CheckIcon className={cn("h-5 w-5", color.checkColorClass ?? "text-white")} aria-hidden />
                ) : null}
              </span>
              <span className={cn("truncate text-zinc-800", textSizeClass)}>{color.label}</span>
            </button>
          ))}
        </div>
      </FilterGroup>

      <CheckboxGroupBlock
        title="品牌"
        options={productsFilterOptions.brand}
        selectedValues={selectedFilters.brand}
        onToggleOption={(option) => onToggleFilter("brand", option)}
        textSizeClass={textSizeClass}
        collapsedCount={4}
      />
      <CheckboxGroupBlock
        title="運動"
        options={productsFilterOptions.sport}
        selectedValues={selectedFilters.sport}
        onToggleOption={(option) => onToggleFilter("sport", option)}
        textSizeClass={textSizeClass}
      />
      <CheckboxGroupBlock
        title="適合"
        options={productsFilterOptions.fit}
        selectedValues={selectedFilters.fit}
        onToggleOption={(option) => onToggleFilter("fit", option)}
        textSizeClass={textSizeClass}
      />
      <CheckboxGroupBlock
        title="特點"
        options={productsFilterOptions.feature}
        selectedValues={selectedFilters.feature}
        onToggleOption={(option) => onToggleFilter("feature", option)}
        textSizeClass={textSizeClass}
      />
      <CheckboxGroupBlock
        title="技術"
        options={productsFilterOptions.tech}
        selectedValues={selectedFilters.tech}
        onToggleOption={(option) => onToggleFilter("tech", option)}
        textSizeClass={textSizeClass}
      />
    </>
  );
}
