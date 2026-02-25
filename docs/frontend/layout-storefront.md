# Storefront AppLayout (M2)

## Objective

建立可支撐 Nike 風格導覽體驗的前台版型，先確立 IA，再進入 M3 UI 細節。

## Layout structure

1. Top announcement bar
2. Sticky header
3. Desktop primary nav (`md+`)
4. Main content container
5. Footer
6. Mobile bottom nav (`< md`)

## Navigation model

- Desktop: `Home / Products / Cart / Checkout`
- Mobile: `Home / Shop / Cart / Pay`
- `/admin` 不放在主要前台導覽，僅於 footer 提供入口

## Route group strategy

- Storefront layout: `src/app/(storefront)/layout.tsx`
- Storefront UI layout component: `src/components/layout/AppLayout.tsx`
- Admin layout: `src/app/admin/layout.tsx`
- Root layout 只負責全域樣式與 metadata，不承擔商業頁面導覽

## Mobile-first principles (M2 baseline)

- 底部導覽固定顯示，降低單手操作成本
- Header 採 sticky，保持關鍵操作可見
- 導覽層級先扁平化，避免初期資訊架構過深

## Next phase handoff

M3 開始前，每個頁面都需補對應 UI spec：

- `docs/ui/storefront/home.md`
- `docs/ui/storefront/plp.md`
- `docs/ui/storefront/pdp.md`
- `docs/ui/storefront/cart-checkout.md`
