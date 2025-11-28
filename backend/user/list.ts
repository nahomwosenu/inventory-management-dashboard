import { api } from "encore.dev/api";
import db from "../db";
import type { User } from "./create";

export interface ListUsersResponse {
  users: User[];
}

// Retrieves all users.
export const list = api<void, ListUsersResponse>(
  { expose: true, method: "GET", path: "/users", auth: true },
  async () => {
    const users = await db.queryAll<User>`
      SELECT id, phone_number as "phoneNumber", name, role, created_at as "createdAt"
      FROM users
      ORDER BY created_at DESC
    `;
    
    return { users };
  }
);
