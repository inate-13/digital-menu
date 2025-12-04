import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { file, filename } = req.body;
  if (!file) return res.status(400).json({ error: "No file" });

  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "digital-menu/dishes",
      public_id: filename,
      resource_type: "image",
    });
    return res.status(200).json({ ok: true, url: result.secure_url });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
}
