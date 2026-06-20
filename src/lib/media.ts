import cloudinary from "@/lib/cloudinary";

export async function getMediaFiles() {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "media/",
      max_results: 100,
      resource_type: "image",
    });

    return (
      result.resources as Array<{
        public_id: string;
        secure_url: string;
        format: string;
        bytes: number;
        created_at: string;
      }>
    ).map((asset) => ({
      name: asset.public_id.replace("media/", ""),
      public_id: asset.public_id,
      url: asset.secure_url,
      format: asset.format,
      bytes: asset.bytes,
      created_at: asset.created_at,
    }));
  } catch (err) {
    console.error("Failed to fetch media from Cloudinary:", err);
    return [];
  }
}