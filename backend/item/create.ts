import { api } from "encore.dev/api";
import db from "../db";

export interface CreateItemRequest {
  code: string;
  name: string;
  description?: string;
  quantity: number;
  price?: number;
}

export interface Item {
  id: number;
  code: string;
  name: string;
  description?: string;
  quantity: number;
  price?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Creates a new item.
export const create = api<CreateItemRequest, Item>(
  { expose: true, method: "POST", path: "/items", auth: true },
  async (req) => {
    const item = await db.queryRow<Item>`
      INSERT INTO items (code, name, description, quantity, price)
      VALUES (${req.code}, ${req.name}, ${req.description || null}, ${req.quantity}, ${req.price || null})
      RETURNING id, code, name, description, quantity, price, created_at as "createdAt", updated_at as "updatedAt"
    `;
    
    if (!item) {
      throw new Error("Failed to create item");
    }
    
    return item;
  }
);
