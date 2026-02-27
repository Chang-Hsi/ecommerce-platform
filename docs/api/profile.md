# Profile API 規格（M5 Batch 2）

更新日期：2026-02-27

## 1. 共通規範

- Base：同源 `/api/*`
- Auth：皆需登入（`httpOnly` cookies：access/refresh token）
- 回應 envelope：

```json
{
  "code": 0,
  "message": "ok",
  "data": {}
}
```

- 未登入：`401`

```json
{
  "code": 401,
  "message": "請先登入",
  "data": {}
}
```

## 2. 資料模型（前端使用）

```ts
type ProfileState = {
  account: {
    firstName: string;
    lastName: string;
    email: string;
    passwordMask: string;
    birthday: string;
    country: string;
    district: string;
    city: string;
    postalCode: string;
  };
  addresses: Array<{
    id: string;
    recipientLastName: string;
    recipientFirstName: string;
    phone: string;
    country: string;
    city: string;
    district: string;
    addressLine1: string;
    postalCode: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
  preferences: {
    shoeSize: string;
    primaryPreference: "women" | "men";
    otherPreferences: Array<"girls" | "boys" | "women" | "men">;
    measurementUnit: "metric" | "imperial";
  };
  visibility: {
    displayName: string;
    avatarText: string;
    avatarUrl: string;
    reviewVisibility: "private" | "community" | "public";
    locationSharing: "friends" | "none";
  };
  privacy: {
    adsByUsageData: boolean;
    adsByProfileData: boolean;
    useFitnessData: boolean;
  };
  updatedAt: string;
};
```

## 3. API 一覽

### 3.1 `GET /api/profile`

- 說明：取得完整 ProfileState

成功回應：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "profile": {
      "account": {
        "firstName": "",
        "lastName": "",
        "email": "user@example.com",
        "passwordMask": "••••••••••••••••",
        "birthday": "",
        "country": "",
        "district": "",
        "city": "",
        "postalCode": ""
      },
      "addresses": [],
      "preferences": {
        "shoeSize": "",
        "primaryPreference": "women",
        "otherPreferences": [],
        "measurementUnit": "metric"
      },
      "visibility": {
        "displayName": "個人檔案顯示資訊",
        "avatarText": "",
        "avatarUrl": "",
        "reviewVisibility": "community",
        "locationSharing": "none"
      },
      "privacy": {
        "adsByUsageData": true,
        "adsByProfileData": true,
        "useFitnessData": true
      },
      "updatedAt": "2026-02-27T00:00:00.000Z"
    }
  }
}
```

### 3.2 `PUT /api/profile/account`

- 說明：更新帳號詳細資訊
- body：

```json
{
  "firstName": "小美",
  "lastName": "王",
  "email": "user@example.com",
  "passwordMask": "••••••••••••••••",
  "birthday": "1992-01-26",
  "country": "台灣",
  "district": "桃園區",
  "city": "桃園市",
  "postalCode": "330"
}
```

- 成功：回傳最新 `profile`
- 失敗：
  - `400`：格式錯誤
  - `409`：Email 重複

### 3.3 `DELETE /api/profile/account`

- 說明：刪除當前登入帳號（含關聯資料清理）
- 成功回應：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "success": true
  }
}
```

### 3.4 `POST /api/profile/addresses`

- 說明：新增地址
- body：

```json
{
  "recipientLastName": "王",
  "recipientFirstName": "小美",
  "phone": "0912000111",
  "country": "台灣",
  "city": "桃園市",
  "district": "桃園區",
  "addressLine1": "中寧街50巷10號",
  "postalCode": "330",
  "isDefault": true
}
```

- 成功：回傳最新 `profile`

### 3.5 `DELETE /api/profile/addresses/[addressId]`

- 說明：刪除指定地址
- 成功：回傳最新 `profile`

### 3.6 `PUT /api/profile/preferences`

- 說明：更新購物偏好
- body：

```json
{
  "shoeSize": "CM 28",
  "primaryPreference": "women",
  "otherPreferences": ["women", "girls"],
  "measurementUnit": "metric"
}
```

- 成功：回傳最新 `profile`

### 3.7 `PUT /api/profile/privacy`

- 說明：更新隱私設定
- body：

```json
{
  "adsByUsageData": true,
  "adsByProfileData": true,
  "useFitnessData": false
}
```

- 成功：回傳最新 `profile`

### 3.8 `PUT /api/profile/visibility`

- 說明：更新個人檔案能見度
- body：

```json
{
  "displayName": "個人檔案顯示資訊",
  "avatarText": "Ace12345",
  "avatarUrl": "https://res.cloudinary.com/.../avatar.webp",
  "reviewVisibility": "community",
  "locationSharing": "none"
}
```

- 成功：回傳最新 `profile`

### 3.9 `POST /api/profile/avatar`

- 說明：上傳頭像
- content-type：`multipart/form-data`
- 欄位：
  - `file`: image file
- server 流程：
  1. 驗證檔案格式與大小
  2. `sharp` 轉 WebP
  3. 上傳 Cloudinary
  4. 更新 `UserProfile.avatarUrl`

成功回應：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "profile": {
      "visibility": {
        "avatarUrl": "https://res.cloudinary.com/<cloud>/image/upload/.../avatar.webp"
      }
    }
  }
}
```

## 4. 首次登入策略（已落地）

- 使用者首次通過 email OTP 驗證時：
  - 建立 `User`
  - 系統生成隨機密碼後存成 `passwordHash`
  - Profile 預設資料為空（除 `email` / `passwordMask`）

## 5. 測試建議

- 先呼叫 `POST /api/auth/login/request-code` 與 `POST /api/auth/login/verify`
- 取得 cookie session 後再測 `/api/profile*`
- 若要測上傳：
  - `.env.local` 需設定：
    - `BACKSTAGE_IMAGE_UPLOAD_ENABLED=true`
    - `BACKSTAGE_IMAGE_UPLOAD_MAX_MB=5`
    - `CLOUDINARY_CLOUD_NAME`
    - `CLOUDINARY_API_KEY`
    - `CLOUDINARY_API_SECRET`
