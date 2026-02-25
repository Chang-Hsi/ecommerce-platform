# Admin Development Rules

這份文件定義後台（`/admin`）開發規則，供後續 M7-M8 使用。

## Scope

- URL scope: `/admin`
- Route entry folder: `src/app/admin/*`

## Core pattern

1. Route files stay thin.
2. Feature pages hold composition logic.
3. Shared admin layout/components stay in dedicated component folders.

## Required structure

```txt
src/
  app/
    admin/
      layout.tsx
      page.tsx
      products/page.tsx
      orders/page.tsx
  features/
    admin/
      dashboard/AdminDashboardPage.tsx
      products/AdminProductsPage.tsx
      orders/AdminOrdersPage.tsx
  components/
    admin/
      layout/
        AdminAppLayout.tsx
        AdminHeader.tsx
        AdminSidebar.tsx
      tables/
      forms/
```

## File responsibilities

- `src/app/admin/**/page.tsx`
  - route params/search params parsing only
  - render feature page component only
- `src/features/admin/**`
  - page composition
  - section-level state orchestration
  - domain-focused presentation wiring
- `src/components/admin/**`
  - reusable UI building blocks

## Naming convention

- Route file export: `*RoutePage` (example: `AdminProductsRoutePage`)
- Feature page component: `*Page` (example: `AdminProductsPage`)
- Layout component: `Admin*Layout`

## API / auth boundary

- Admin pages do not trust client-only checks.
- Every admin API endpoint must validate auth + RBAC server-side.
- UI can hide controls, but API authorization is mandatory.

## Definition of done for each admin page

- Route file is thin and delegates to feature page.
- Feature page exists under `src/features/admin/*`.
- Reusable blocks extracted to `src/components/admin/*`.
- `npm run lint` and `npm run typecheck` pass.
