import { api } from "encore.dev/api";
import db from "../db";
import type { Item } from "./create";

export interface ListItemsResponse {
  items: Item[];
}

// Retrieves all items.
export const list = api<void, ListItemsResponse>(
  { expose: true, method: "GET", path: "/items", auth: true },
  async () => {
    const items = await db.queryAll<Item>`
      SELECT id, code, name, description, quantity, price, created_at as "createdAt", updated_at as "updatedAt"
      FROM items
      ORDER BY name
    `;
    
    return { items };
  }
);
