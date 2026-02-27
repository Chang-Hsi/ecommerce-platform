import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type HelpSearchBarProps = {
  placeholder: string;
  defaultQuery?: string;
};

export function HelpSearchBar({ placeholder, defaultQuery = "" }: Readonly<HelpSearchBarProps>) {
  return (
    <form action="/help" className="mx-auto w-full max-w-2xl">
      <div className="relative">
        <input
          id="help-search-input"
          name="q"
          type="search"
          defaultValue={defaultQuery}
          placeholder=" "
          className="peer h-12 w-full rounded-md border border-zinc-400 bg-transparent px-4 pt-3 pr-12 text-base text-zinc-900 outline-none focus:border-blue-600"
        />
        <label
          htmlFor="help-search-input"
          className="pointer-events-none absolute -top-2 left-3 z-10 bg-[var(--background)] px-1 text-xs text-zinc-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:translate-y-0 peer-focus:text-xs"
        >
          {placeholder}
        </label>

        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-600"
          aria-label="搜尋協助"
        >
          <MagnifyingGlassIcon className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </form>
  );
}
