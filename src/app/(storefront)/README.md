# Storefront Development Rules

這份文件定義前台（含登入/驗證流程）目前的路由規劃與實作邊界。

## Scope

- Storefront URL scope: `/`, `/products`, `/products/[slug]`, `/cart`, `/checkout`, `/favorites`, `/help`, `/join`, `/snkrs`
- Auth URL scope: `/login`, `/login/verify`

說明：
- `/login` 與 `/login/verify` 雖然是前台流程的一部分，但路由檔放在 `src/app/(auth)/*`，不放在 `src/app/(storefront)/*`。
- 這樣可以讓登入頁使用獨立 `AuthLayout`，避免套用 storefront 的 Header/Footer。

## Route Structure (Current)

```txt
src/
  app/
    (storefront)/
      layout.tsx              # AppLayout (Header/Footer/MobileBottomNav)
      page.tsx
      products/page.tsx
      products/[slug]/page.tsx
      cart/page.tsx
      checkout/page.tsx
      favorites/page.tsx
      help/page.tsx
      join/page.tsx
      snkrs/page.tsx
    (auth)/
      layout.tsx              # AuthLayout (only auth page content)
      login/page.tsx
      login/verify/page.tsx
```

## Current Login/Register Flow (M3 Mock)

1. User clicks `Header` login entry.
2. Header builds `redirect` query from current URL and navigates to `/login?redirect=...`.
3. On `/login`:
   - If email account exists in local mock store: sign in immediately and redirect back.
   - If account does not exist: create verification challenge and navigate to `/login/verify`.
4. On `/login/verify`:
   - User enters 8-digit code.
   - Verification success creates account + session, then redirects to `redirect` URL.
5. Header session state updates to signed-in:
   - top utility displays `Hi, xxx`
   - hover opens account dropdown
   - dropdown supports sign-out

## Temporary Mock Implementation (Not Connected to Backend Yet)

目前尚未串接後端。暫時使用前端模擬方案：

- Storage:
  - accounts: `localStorage` (`swooshlab.mock-auth.accounts.v1`)
  - session: `localStorage` (`swooshlab.mock-auth.session.v1`)
  - verification challenge: `localStorage` (`swooshlab.mock-auth.verify.v1`)
- Core files:
  - `src/lib/auth/mock-auth.ts`
  - `src/hooks/auth/useMockAuthSession.ts`
  - `src/features/auth/LoginPage.tsx`
  - `src/features/auth/LoginVerifyPage.tsx`
- Demo behavior:
  - verification code is generated locally
  - page may show demo code for local testing
  - fallback test code `12345678` is accepted

## Known Limitations (Current Mock)

- Client-side only; no real server trust boundary.
- No real email delivery provider.
- Session is not httpOnly cookie-based.
- Account/session state is device-local only.
- Not suitable for production security requirements.

## Planned Migration to Real Auth

未來將在 M5/M8（API 與後台能力）逐步替換為正式驗證機制，方向如下：

1. Keep route URLs unchanged:
   - continue using `/login` and `/login/verify`
2. Introduce server auth APIs:
   - `/api/auth/login`
   - `/api/auth/verify`
   - `/api/auth/logout`
   - `/api/auth/session`
3. Move identity/session to database:
   - user/account table
   - verification token/session table
   - auth session table
4. Replace localStorage session with secure server session:
   - signed + httpOnly + secure cookie
   - middleware/session guard for protected routes
5. Replace local verification code with provider-based delivery:
   - email OTP service
   - resend rate-limit and expiration control
6. Keep UI composition mostly unchanged:
   - `features/auth/*` and `Header` keep same behavior contract
   - data source shifts from `mock-auth.ts` to API client
