type QuantityStepperProps = {
  qty: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

export function QuantityStepper({ qty, onDecrease, onIncrease }: Readonly<QuantityStepperProps>) {
  return (
    <div className="inline-flex h-10 items-center rounded-full border border-zinc-300 bg-white px-2">
      <button
        type="button"
        onClick={onDecrease}
        disabled={qty <= 1}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-lg text-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-300"
        aria-label="減少數量"
      >
        -
      </button>
      <span className="min-w-6 text-center text-base text-zinc-900">{qty}</span>
      <button
        type="button"
        onClick={onIncrease}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-lg text-zinc-700"
        aria-label="增加數量"
      >
        +
      </button>
    </div>
  );
}
