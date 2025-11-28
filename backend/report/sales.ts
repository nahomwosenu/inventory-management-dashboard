import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import db from "../db";

export interface SalesReportRequest {
  startDate: Query<string>;
  endDate: Query<string>;
}

export interface SalesReportItem {
  itemCode: string;
  itemName: string;
  totalQuantity: number;
  totalRevenue: number;
  salesCount: number;
}

export interface SalesReportResponse {
  items: SalesReportItem[];
  totalRevenue: number;
  totalSales: number;
}

// Retrieves sales report for a date range.
export const sales = api<SalesReportRequest, SalesReportResponse>(
  { expose: true, method: "GET", path: "/reports/sales", auth: true },
  async (req) => {
    const items = await db.rawQueryAll<SalesReportItem>(
      `SELECT i.code as "itemCode", i.name as "itemName",
              SUM(s.quantity) as "totalQuantity",
              SUM(s.total_price) as "totalRevenue",
              COUNT(s.id) as "salesCount"
       FROM sales s
       JOIN items i ON s.item_id = i.id
       WHERE s.sale_date >= $1 AND s.sale_date <= $2
       GROUP BY i.code, i.name
       ORDER BY "totalRevenue" DESC`,
      req.startDate,
      req.endDate
    );
    
    const summary = await db.rawQueryRow<{ totalRevenue: number; totalSales: number }>(
      `SELECT COALESCE(SUM(total_price), 0) as "totalRevenue",
              COUNT(*) as "totalSales"
       FROM sales
       WHERE sale_date >= $1 AND sale_date <= $2`,
      req.startDate,
      req.endDate
    );
    
    return {
      items,
      totalRevenue: summary?.totalRevenue || 0,
      totalSales: summary?.totalSales || 0,
    };
  }
);
