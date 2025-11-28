import { api } from "encore.dev/api";
import db from "../db";
import type { Item } from "./create";

export interface UpdateItemRequest {
  id: number;
  code?: string;
  name?: string;
  description?: string;
  quantity?: number;
  price?: number;
}

// Updates an existing item.
export const update = api<UpdateItemRequest, Item>(
  { expose: true, method: "PUT", path: "/items/:id", auth: true },
  async (req) => {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (req.code !== undefined) {
      updates.push(`code = $${paramCount++}`);
      values.push(req.code);
    }
    if (req.name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(req.name);
    }
    if (req.description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(req.description);
    }
    if (req.quantity !== undefined) {
      updates.push(`quantity = $${paramCount++}`);
      values.push(req.quantity);
    }
    if (req.price !== undefined) {
      updates.push(`price = $${paramCount++}`);
      values.push(req.price);
    }

    updates.push(`updated_at = NOW()`);
    values.push(req.id);

    const item = await db.rawQueryRow<Item>(
      `UPDATE items SET ${updates.join(', ')} 
       WHERE id = $${paramCount}
       RETURNING id, code, name, description, quantity, price, created_at as "createdAt", updated_at as "updatedAt"`,
      ...values
    );

    if (!item) {
      throw new Error("Item not found");
    }

    return item;
  }
);
