import { api } from "encore.dev/api";
import db from "../db";

export interface AnnouncementWithAuthor {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  createdBy: number;
  authorName: string;
  createdAt: Date;
}

export interface ListAnnouncementsResponse {
  announcements: AnnouncementWithAuthor[];
}

export const list = api<void, ListAnnouncementsResponse>(
  { expose: true, method: "GET", path: "/announcements", auth: false },
  async () => {
    const announcements = await db.queryAll<AnnouncementWithAuthor>`
      SELECT a.id, a.title, a.content, a.image_url as "imageUrl", a.created_by as "createdBy",
             u.name as "authorName", a.created_at as "createdAt"
      FROM announcements a
      JOIN users u ON a.created_by = u.id
      ORDER BY a.created_at DESC
    `;
    
    return { announcements };
  }
);
