import { api } from "encore.dev/api";
import db from "../db";

export interface AnnouncementWithAuthor {
  id: number;
  title: string;
  content: string;
  createdBy: number;
  authorName: string;
  createdAt: Date;
}

export interface ListAnnouncementsResponse {
  announcements: AnnouncementWithAuthor[];
}

// Retrieves all announcements.
export const list = api<void, ListAnnouncementsResponse>(
  { expose: true, method: "GET", path: "/announcements", auth: true },
  async () => {
    const announcements = await db.queryAll<AnnouncementWithAuthor>`
      SELECT a.id, a.title, a.content, a.created_by as "createdBy",
             u.name as "authorName", a.created_at as "createdAt"
      FROM announcements a
      JOIN users u ON a.created_by = u.id
      ORDER BY a.created_at DESC
    `;
    
    return { announcements };
  }
);
