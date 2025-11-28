import { api } from "encore.dev/api";
import db from "../db";

export interface DeleteItemRequest {
  id: number;
}

// Deletes an item.
export const deleteItem = api<DeleteItemRequest, void>(
  { expose: true, method: "DELETE", path: "/items/:id", auth: true },
  async (req) => {
    await db.exec`DELETE FROM items WHERE id = ${req.id}`;
  }
);
