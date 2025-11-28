import { api } from "encore.dev/api";
import db from "../db";

export interface InventoryReportItem {
  id: number;
  code: string;
  name: string;
  quantity: number;
  price?: number;
  totalValue: number;
  createdAt: Date;
}

export interface InventoryReportResponse {
  items: InventoryReportItem[];
  totalItems: number;
  totalValue: number;
  itemsAddedToday: number;
}

// Retrieves current inventory report.
export const inventory = api<void, InventoryReportResponse>(
  { expose: true, method: "GET", path: "/reports/inventory", auth: true },
  async () => {
    const items = await db.queryAll<InventoryReportItem>`
      SELECT id, code, name, quantity, price,
             COALESCE(price * quantity, 0) as "totalValue",
             created_at as "createdAt"
      FROM items
      ORDER BY name
    `;
    
    const summary = await db.queryRow<{ totalValue: number; itemsAddedToday: number }>`
      SELECT COALESCE(SUM(price * quantity), 0) as "totalValue",
             COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END) as "itemsAddedToday"
      FROM items
    `;
    
    return {
      items,
      totalItems: items.length,
      totalValue: summary?.totalValue || 0,
      itemsAddedToday: summary?.itemsAddedToday || 0,
    };
  }
);
