import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import db from "../db";

export interface PurchaseReportRequest {
  startDate: Query<string>;
  endDate: Query<string>;
}

export interface PurchaseReportItem {
  itemName: string;
  itemCode?: string;
  totalQuantity: number;
  totalEstimatedCost: number;
  requestCount: number;
  approvedCount: number;
  deniedCount: number;
}

export interface PurchaseReportResponse {
  items: PurchaseReportItem[];
  totalEstimatedCost: number;
  totalRequests: number;
}

// Retrieves purchase report for a date range.
export const purchase = api<PurchaseReportRequest, PurchaseReportResponse>(
  { expose: true, method: "GET", path: "/reports/purchase", auth: true },
  async (req) => {
    const items = await db.rawQueryAll<PurchaseReportItem>(
      `SELECT item_name as "itemName", item_code as "itemCode",
              SUM(quantity) as "totalQuantity",
              COALESCE(SUM(estimated_price * quantity), 0) as "totalEstimatedCost",
              COUNT(*) as "requestCount",
              SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as "approvedCount",
              SUM(CASE WHEN status = 'denied' THEN 1 ELSE 0 END) as "deniedCount"
       FROM purchase_requests
       WHERE created_at >= $1 AND created_at <= $2
       GROUP BY item_name, item_code
       ORDER BY "totalEstimatedCost" DESC`,
      req.startDate,
      req.endDate
    );
    
    const summary = await db.rawQueryRow<{ totalEstimatedCost: number; totalRequests: number }>(
      `SELECT COALESCE(SUM(estimated_price * quantity), 0) as "totalEstimatedCost",
              COUNT(*) as "totalRequests"
       FROM purchase_requests
       WHERE created_at >= $1 AND created_at <= $2`,
      req.startDate,
      req.endDate
    );
    
    return {
      items,
      totalEstimatedCost: summary?.totalEstimatedCost || 0,
      totalRequests: summary?.totalRequests || 0,
    };
  }
);
