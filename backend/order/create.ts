import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

export interface CreateOrderRequest {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  item_id: number;
  quantity: number;
  payment_method: "cash" | "bank_transfer" | "credit";
  notes?: string;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  item_id: number;
  item_name: string;
  quantity: number;
  total_price: number;
  payment_method: string;
  notes: string | null;
  status: string;
  created_by_user_id: number | null;
  created_at: Date;
}

export const create = api(
  { method: "POST", path: "/orders", expose: true, auth: true },
  async (req: CreateOrderRequest): Promise<Order> => {
    const auth = getAuthData()!;

    const item = await db.queryRow`
      SELECT id, name, price, quantity 
      FROM items 
      WHERE id = ${req.item_id}
    `;

    if (!item) {
      throw new Error("Item not found");
    }

    if (item.quantity < req.quantity) {
      throw new Error(`Insufficient stock. Available: ${item.quantity}`);
    }

    const total_price = parseFloat(item.price) * req.quantity;

    const order = await db.queryRow<Order>`
      INSERT INTO orders (
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        item_id,
        item_name,
        quantity,
        total_price,
        payment_method,
        notes,
        created_by_user_id
      ) VALUES (
        ${req.customer_name},
        ${req.customer_email},
        ${req.customer_phone},
        ${req.customer_address},
        ${Number(req.item_id)},
        ${item.name},
        ${Number(req.quantity)},
        ${Number(total_price)},
        ${req.payment_method},
        ${req.notes || null},
        ${Number(auth?.userID) || 0}
      )
      RETURNING *
    `;

    await db.exec`
      UPDATE items 
      SET quantity = quantity - ${req.quantity}
      WHERE id = ${req.item_id}
    `;

    return order!;
  }
);
