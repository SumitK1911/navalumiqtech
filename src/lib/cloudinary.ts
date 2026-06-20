import { createHash } from "crypto";
import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export default cloudinary;

export type CloudinaryResource = {
  public_id: string;
  secure_url: string;
  format?: string;
  bytes?: number;
  created_at?: string;
};

type CloudinaryListResponse = {
  resources?: CloudinaryResource[];
  error?: {
    message?: string;
  };
};

type CloudinaryUploadResponse = CloudinaryResource & {
  error?: {
    message?: string;
  };
};

type CloudinaryDestroyResponse = {
  result?: string;
  error?: {
    message?: string;
  };
};

function getCloudinaryConfig() {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary environment variables are not configured.");
  }

  return {
    cloudName,
    apiKey,
    apiSecret,
  };
}

function signParams(
  params: Record<string, string | number | undefined>,
  secret: string
) {
  const payload = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1").update(`${payload}${secret}`).digest("hex");
}

function readCloudinaryError(
  body: { error?: { message?: string } },
  fallback: string
) {
  return body.error?.message || fallback;
}

export async function listCloudinaryMedia() {
  const config = getCloudinaryConfig();
  const auth = Buffer.from(
    `${config.apiKey}:${config.apiSecret}`
  ).toString("base64");
  const params = new URLSearchParams({
    prefix: "media/",
    max_results: "100",
  });

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/resources/image/upload?${params}`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );
  const body = (await response.json()) as CloudinaryListResponse;

  if (!response.ok) {
    throw new Error(readCloudinaryError(body, "Failed to list media files."));
  }

  return body.resources || [];
}

export async function uploadCloudinaryMedia(file: File) {
  const config = getCloudinaryConfig();
  const timestamp = Math.round(Date.now() / 1000);
  const folder = "media";
  const signature = signParams(
    {
      folder,
      timestamp,
    },
    config.apiSecret
  );
  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", config.apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("folder", folder);
  formData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );
  const body = (await response.json()) as CloudinaryUploadResponse;

  if (!response.ok) {
    throw new Error(readCloudinaryError(body, "Failed to upload media file."));
  }

  return body;
}

export async function deleteCloudinaryMedia(publicId: string) {
  const config = getCloudinaryConfig();
  const timestamp = Math.round(Date.now() / 1000);
  const signature = signParams(
    {
      public_id: publicId,
      timestamp,
    },
    config.apiSecret
  );
  const formData = new FormData();

  formData.append("public_id", publicId);
  formData.append("api_key", config.apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/image/destroy`,
    {
      method: "POST",
      body: formData,
    }
  );
  const body = (await response.json()) as CloudinaryDestroyResponse;

  if (!response.ok || body.result === "not found") {
    throw new Error(readCloudinaryError(body, "Failed to delete media file."));
  }

  return body;
}
