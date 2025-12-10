import { api } from "encore.dev/api";
import db from "../db";

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  createdBy: number;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  createdBy: number;
  createdAt: Date;
}

// Creates a new announcement.
export const create = api<CreateAnnouncementRequest, Announcement>(
  { expose: true, method: "POST", path: "/announcements", auth: true },
  async (req) => {
    const announcement = await db.queryRow<Announcement>`
      INSERT INTO announcements (title, content, created_by)
      VALUES (${req.title}, ${req.content}, ${req.createdBy})
      RETURNING id, title, content, created_by as "createdBy", created_at as "createdAt"
    `;
    
    if (!announcement) {
      throw new Error("Failed to create announcement");
    }
    
    return announcement;
  }
);
