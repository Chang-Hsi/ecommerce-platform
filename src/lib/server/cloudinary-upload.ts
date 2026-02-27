import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";

type UploadProfileAvatarInput = {
  userId: string;
  file: File;
};

function toBoolean(value: string | undefined) {
  return String(value ?? "").trim().toLowerCase() === "true";
}

function getMaxBytes() {
  const maxMb = Number(process.env.BACKSTAGE_IMAGE_UPLOAD_MAX_MB ?? "5");
  const safeMb = Number.isFinite(maxMb) && maxMb > 0 ? maxMb : 5;
  return Math.floor(safeMb * 1024 * 1024);
}

function ensureCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary 設定不完整");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

function uploadBufferToCloudinary(buffer: Buffer, publicId: string) {
  return new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "swooshlab/profile-avatars",
        public_id: publicId,
        format: "webp",
        resource_type: "image",
        overwrite: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary 上傳失敗"));
          return;
        }

        resolve({
          secure_url: result.secure_url,
        });
      },
    );

    stream.end(buffer);
  });
}

export async function uploadProfileAvatarImage(input: UploadProfileAvatarInput) {
  if (!toBoolean(process.env.BACKSTAGE_IMAGE_UPLOAD_ENABLED)) {
    throw new Error("目前未啟用圖片上傳");
  }

  const fileName = input.file.name?.trim() || "avatar";
  const mimeType = input.file.type?.trim().toLowerCase() || "";

  if (!mimeType.startsWith("image/")) {
    throw new Error("僅支援圖片格式");
  }

  const rawBuffer = Buffer.from(await input.file.arrayBuffer());
  if (rawBuffer.byteLength === 0) {
    throw new Error("檔案內容為空");
  }

  const maxBytes = getMaxBytes();
  if (rawBuffer.byteLength > maxBytes) {
    throw new Error(`圖片大小不可超過 ${Math.floor(maxBytes / (1024 * 1024))}MB`);
  }

  const webpBuffer = await sharp(rawBuffer)
    .rotate()
    .resize(1200, 1200, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: 82,
      effort: 4,
    })
    .toBuffer();

  ensureCloudinaryConfig();

  const safeFileName = fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .slice(0, 48) || "avatar";
  const publicId = `${input.userId}-${Date.now()}-${safeFileName}`;

  const uploaded = await uploadBufferToCloudinary(webpBuffer, publicId);
  return uploaded.secure_url;
}
