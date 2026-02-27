# Database Design (M4)

更新日期：2026-02-27

## 1. 目標

- 完成 M4 所需資料庫核心模型：`products/cart/orders/users/profile/auth`
- 提供可直接執行的 Prisma migration 與 seed
- 保留前端 `src/content/*` 靜態資料，直到 M5 API 串接完成再切換資料來源

## 2. Prisma 實體範圍

- 使用者與授權：
  - `User`
  - `AuthSession`
  - `VerificationToken`
- 會員設定：
  - `UserProfile`
  - `UserAddress`

本次新增欄位（M5 Batch 2）：
- `User.passwordHash`：首次登入時系統隨機密碼雜湊
- `User.firstName` / `User.lastName`：會員層級姓名欄位（可空）
- `UserProfile.avatarUrl`：Cloudinary 圖片 URL
- 商品：
  - `Product`
  - `ProductImage`
  - `ProductVariant`
  - `Favorite`
- 購物車與結帳：
  - `Cart`
  - `CartItem`
  - `PromoCode`
  - `Order`
  - `OrderItem`
  - `PaymentAttempt`

## 3. 索引策略

### 3.1 Product / Listing 查詢

- `Product.slug`：唯一索引（PDP 查詢）
- `@@index([status, releaseAt(desc)])`：新品/即將推出排序
- `@@index([category, audience, gender, status])`：PLP 主篩選
- `@@index([brand, status])`：品牌篩選
- `@@index([isSale, status])`：特惠商品入口
- `@@index([isFeatured, status])`：首頁策展與推薦
- `@@index([basePrice])`：價格區間查詢

### 3.2 Variant / 庫存查詢

- `ProductVariant.sku`：唯一索引
- `@@unique([productId, colorLabel, sizeLabel])`：防止重複規格
- `@@index([productId, isActive, stockQty])`：商品頁尺寸與庫存
- `@@index([sizeLabel, isActive])`：尺碼篩選
- `@@index([colorLabel, isActive])`：顏色篩選

### 3.3 Cart / Order 查詢

- `Cart @@index([userId, status, updatedAt(desc)])`：活躍購物車讀取
- `CartItem @@unique([cartId, variantId])`：同購物車同規格去重
- `Order @@index([userId, status, createdAt(desc)])`：會員訂單列表
- `Order @@index([paymentStatus, createdAt(desc)])`：付款狀態追蹤
- `PaymentAttempt @@index([orderId, createdAt(desc)])`：支付歷史
- `Favorite @@unique([userId, productId])`：收藏去重

### 3.4 Profile / Address 查詢

- `UserProfile.userId`：唯一索引（1:1）
- `UserProfile @@index([country, city, district])`：地區查詢
- `UserAddress @@index([userId, isDefault])`：快速取預設地址
- `UserAddress @@index([country, city, district, postalCode])`：地址範圍查詢

## 4. Seed 策略

- 建立 2 位使用者（admin/member）
- 建立 profile、address、promo code（`WELCOME10`）
- 建立多筆商品（含 variant / image）
- 建立 member 的 favorites、active cart、order、payment attempt

## 5. 前端靜態資料遷移策略（本次決議）

- M4 不移除 `src/content/*` 靜態資料。
- M5 API 串接完成後，採「雙軌切換」：
  1. API 回傳 schema 先對齊 `src/content` 既有 shape
  2. UI 增加 repository/data source abstraction
  3. 逐頁切換讀取來源（mock -> API）
  4. 全頁驗收後再刪除不再需要的靜態資料

## 6. Profile 與上傳實作補充（M5 Batch 2）

- Profile API 已改為 DB 來源：`/api/profile*`
- 帳號設定頁（`/profile/*`）已由前端 API client 串接
- 頭像上傳流程：
  1. 前端送 `multipart/form-data`
  2. 後端 `sharp` 轉 WebP 與壓縮
  3. 上傳 Cloudinary
  4. DB 更新 `UserProfile.avatarUrl`
