import { api, APIError } from "encore.dev/api";
import db from "../db";

export interface RegisterSaleRequest {
  itemId: number;
  quantity: number;
  unitPrice: number;
  saleDate: Date;
  createdBy?: number;
}

export interface Sale {
  id: number;
  itemId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  saleDate: Date;
  createdBy?: number;
  createdAt: Date;
}

// Registers a daily sale and updates inventory.
export const register = api<RegisterSaleRequest, Sale>(
  { expose: true, method: "POST", path: "/sales", auth: true },
  async (req) => {
    const tx = await db.begin();
    
    try {
      // Check if item exists and has sufficient quantity
      const item = await tx.queryRow<{ quantity: number }>`
        SELECT quantity FROM items WHERE id = ${req.itemId} FOR UPDATE
      `;
      
      if (!item) {
        throw APIError.notFound("Item not found");
      }
      
      if (item.quantity < req.quantity) {
        throw APIError.invalidArgument("Insufficient quantity in inventory");
      }
      
      // Calculate total price
      const totalPrice = req.unitPrice * req.quantity;
      
      // Insert sale record
      const sale = await tx.queryRow<Sale>`
        INSERT INTO sales (item_id, quantity, unit_price, total_price, sale_date, created_by)
        VALUES (${req.itemId}, ${req.quantity}, ${req.unitPrice}, ${totalPrice}, ${req.saleDate}, ${req.createdBy || null})
        RETURNING id, item_id as "itemId", quantity, unit_price as "unitPrice", 
                  total_price as "totalPrice", sale_date as "saleDate", 
                  created_by as "createdBy", created_at as "createdAt"
      `;
      
      if (!sale) {
        throw new Error("Failed to register sale");
      }
      
      // Update inventory
      await tx.exec`
        UPDATE items 
        SET quantity = quantity - ${req.quantity}, updated_at = NOW()
        WHERE id = ${req.itemId}
      `;
      
      await tx.commit();
      return sale;
    } catch (err) {
      await tx.rollback();
      throw err;
    }
  }
);
