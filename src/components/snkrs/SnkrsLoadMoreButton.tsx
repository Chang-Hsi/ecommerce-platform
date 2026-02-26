type SnkrsLoadMoreButtonProps = {
  label: string;
  onClick: () => void;
};

export function SnkrsLoadMoreButton({ label, onClick }: Readonly<SnkrsLoadMoreButtonProps>) {
  return (
    <div className="flex justify-center pt-8">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex h-9 items-center rounded-full border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-800"
      >
        {label}
      </button>
    </div>
  );
}
