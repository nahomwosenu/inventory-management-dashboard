import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import db from "../db";

export interface SaleWithItem {
  id: number;
  itemId: number;
  itemCode: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  saleDate: Date;
  createdAt: Date;
}

export interface ListSalesRequest {
  startDate?: Query<string>;
  endDate?: Query<string>;
}

export interface ListSalesResponse {
  sales: SaleWithItem[];
}

// Retrieves sales with optional date filtering.
export const list = api<ListSalesRequest, ListSalesResponse>(
  { expose: true, method: "GET", path: "/sales", auth: true },
  async (req) => {
    let query = `
      SELECT s.id, s.item_id as "itemId", i.code as "itemCode", i.name as "itemName",
             s.quantity, s.unit_price as "unitPrice", s.total_price as "totalPrice",
             s.sale_date as "saleDate", s.created_at as "createdAt"
      FROM sales s
      JOIN items i ON s.item_id = i.id
    `;
    
    const conditions: string[] = [];
    const params: any[] = [];
    let paramCount = 1;
    
    if (req.startDate) {
      conditions.push(`s.sale_date >= $${paramCount++}`);
      params.push(req.startDate);
    }
    
    if (req.endDate) {
      conditions.push(`s.sale_date <= $${paramCount++}`);
      params.push(req.endDate);
    }
    
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    query += ` ORDER BY s.sale_date DESC, s.created_at DESC`;
    
    const sales = await db.rawQueryAll<SaleWithItem>(query, ...params);
    
    return { sales };
  }
);
