import Link from "next/link";

const cartItems = [
  { name: "Air Zoom Pegasus 41", qty: 1, price: 4200 },
  { name: "Everyday Crew Socks", qty: 2, price: 480 },
];

export function CartPage() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h1 className="text-2xl font-black text-zinc-900">Cart</h1>
        {cartItems.map((item) => (
          <article
            key={item.name}
            className="flex items-center justify-between border-b border-zinc-200 pb-3"
          >
            <div>
              <p className="font-semibold text-zinc-900">{item.name}</p>
              <p className="text-sm text-zinc-600">Qty {item.qty}</p>
            </div>
            <p className="font-semibold text-zinc-800">
              NT$ {(item.price * item.qty).toLocaleString()}
            </p>
          </article>
        ))}
      </section>

      <aside className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-lg font-bold text-zinc-900">Summary</h2>
        <div className="flex items-center justify-between text-sm text-zinc-700">
          <span>Subtotal</span>
          <span>NT$ {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-zinc-700">
          <span>Shipping</span>
          <span>NT$ 120</span>
        </div>
        <div className="border-t border-zinc-200 pt-3 text-sm font-bold text-zinc-900">
          Total: NT$ {(subtotal + 120).toLocaleString()}
        </div>
        <Link
          href="/checkout"
          className="block rounded-full bg-zinc-900 px-5 py-2 text-center text-sm font-semibold text-white"
        >
          Go to Checkout
        </Link>
      </aside>
    </div>
  );
}
