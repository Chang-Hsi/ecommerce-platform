import type { SnkrsTab } from "@/lib/snkrs/types";

type SnkrsTabsProps = {
  tabs: Array<{ value: SnkrsTab; label: string }>;
  activeTab: SnkrsTab;
  onChangeTab: (nextTab: SnkrsTab) => void;
};

export function SnkrsTabs({ tabs, activeTab, onChangeTab }: Readonly<SnkrsTabsProps>) {
  return (
    <nav className="mx-auto flex h-12 items-end gap-8" aria-label="SNKRS 分頁">
      {tabs.map((tab) => {
        const isActive = tab.value === activeTab;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChangeTab(tab.value)}
            className={`h-12 border-b-2 px-1 pb-2 text-sm font-medium transition-colors ${
              isActive ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
