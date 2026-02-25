import type { ProductDetailSpecs } from "@/content/product-detail";

type ProductSpecsProps = {
  description: string;
  specs: ProductDetailSpecs;
};

export function ProductSpecs({ description, specs }: Readonly<ProductSpecsProps>) {
  return (
    <section className="space-y-4 border-t border-zinc-200 pt-5">
      <p className="text-lg leading-8 text-zinc-800">{description}</p>

      <ul className="list-disc space-y-1 pl-5 text-base text-zinc-700">
        <li>顯示顏色：{specs.color}</li>
        <li>款式：{specs.styleCode}</li>
        <li>原產國/地區：{specs.origin}</li>
      </ul>

      <button type="button" className="text-base font-medium text-zinc-900 underline underline-offset-4">
        檢視產品詳細資料
      </button>
    </section>
  );
}
