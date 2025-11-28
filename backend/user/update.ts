import { api } from "encore.dev/api";
import db from "../db";
import type { User } from "./create";

export interface UpdateUserRequest {
  id: number;
  phoneNumber?: string;
  name?: string;
  role?: "manager" | "finance" | "store";
}

// Updates an existing user.
export const update = api<UpdateUserRequest, User>(
  { expose: true, method: "PUT", path: "/users/:id", auth: true },
  async (req) => {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (req.phoneNumber) {
      updates.push(`phone_number = $${paramCount++}`);
      values.push(req.phoneNumber);
    }
    if (req.name) {
      updates.push(`name = $${paramCount++}`);
      values.push(req.name);
    }
    if (req.role) {
      updates.push(`role = $${paramCount++}`);
      values.push(req.role);
    }

    values.push(req.id);

    const user = await db.rawQueryRow<User>(
      `UPDATE users SET ${updates.join(', ')} 
       WHERE id = $${paramCount}
       RETURNING id, phone_number as "phoneNumber", name, role, created_at as "createdAt"`,
      ...values
    );

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
);
