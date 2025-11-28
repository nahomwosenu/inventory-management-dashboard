import { api } from "encore.dev/api";
import db from "../db";

export interface DeleteUserRequest {
  id: number;
}

// Deletes a user.
export const deleteUser = api<DeleteUserRequest, void>(
  { expose: true, method: "DELETE", path: "/users/:id", auth: true },
  async (req) => {
    await db.exec`DELETE FROM users WHERE id = ${req.id}`;
  }
);
