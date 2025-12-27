import { api } from "encore.dev/api";
import db from "../db";
import { postImages } from "./bucket";

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  imageData?: string;
  imageFileName?: string;
  createdBy?: number;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  createdBy?: number;
  createdAt: Date;
}

export const create = api<CreateAnnouncementRequest, Announcement>(
  { expose: true, method: "POST", path: "/announcements", auth: false },
  async (req) => {
    let imageUrl: string | undefined;

    if (req.imageData && req.imageFileName) {
      const base64Data = req.imageData.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const timestamp = Date.now();
      const fileName = `${timestamp}-${req.imageFileName}`;
      
      await postImages.upload(fileName, buffer, {
        contentType: req.imageData.match(/data:image\/(\w+);/)?.[0].replace("data:", "").replace(";", "") || "image/jpeg",
      });
      
      imageUrl = postImages.publicUrl(fileName);
    }

    const announcement = await db.queryRow<Announcement>`
      INSERT INTO announcements (title, content, image_url, created_by)
      VALUES (${req.title}, ${req.content}, ${imageUrl || null}, ${req.createdBy || 1})
      RETURNING id, title, content, image_url as "imageUrl", created_by as "createdBy", created_at as "createdAt"
    `;

    if (!announcement) {
      throw new Error("Failed to create announcement");
    }

    return announcement;
  }
);
