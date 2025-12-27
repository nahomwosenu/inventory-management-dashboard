import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import db from "../db";

export interface OrdersReportRequest {
  startDate?: Query<string>;
  endDate?: Query<string>;
}

export interface OrdersReportItem {
  itemName: string;
  totalQuantity: number;
  totalRevenue: number;
  ordersCount: number;
}

export interface OrdersByPaymentMethod {
  payment_method: string;
  count: number;
  total_revenue: number;
}

export interface OrdersByStatus {
  status: string;
  count: number;
}

export interface OrdersReportResponse {
  items: OrdersReportItem[];
  byPaymentMethod: OrdersByPaymentMethod[];
  byStatus: OrdersByStatus[];
  totalRevenue: number;
  totalOrders: number;
}

export const orders = api<OrdersReportRequest, OrdersReportResponse>(
  { expose: true, method: "GET", path: "/reports/orders", auth: true },
  async (req) => {
    console.log('###input', req.startDate, req.endDate);
    const items = await db.rawQueryAll<OrdersReportItem>(
      `SELECT item_name as "itemName",
              SUM(quantity) as "totalQuantity",
              SUM(total_price) as "totalRevenue",
              COUNT(id) as "ordersCount"
       FROM orders
       WHERE created_at >= '${req.startDate}' AND created_at <= '${req.endDate}'
       GROUP BY item_name
       ORDER BY "totalRevenue" DESC`
    );

    console.log('###items', items);

    const byPaymentMethod = await db.rawQueryAll<OrdersByPaymentMethod>(
      `SELECT payment_method,
              COUNT(*) as count,
              SUM(total_price) as total_revenue
       FROM orders
       WHERE created_at >= '${req.startDate}' AND created_at <= '${req.endDate}'
       GROUP BY payment_method`
    );
    console.log('###byPaymentMethod', byPaymentMethod);

    const byStatus = await db.rawQueryAll<OrdersByStatus>(
      `SELECT status,
              COUNT(*) as count
       FROM orders
       WHERE created_at >= '${req.startDate}' AND created_at <= '${req.endDate}'
       GROUP BY status`
    );
    console.log('###byStatus', byStatus);

    const summary = await db.rawQueryRow<{ totalRevenue: number; totalOrders: number }>(
      `SELECT COALESCE(SUM(total_price), 0) as "totalRevenue",
              COUNT(*) as "totalOrders"
       FROM orders
       WHERE created_at >= '${req.startDate}' AND created_at <= '${req.endDate}'`
    );
    console.log('###summary', summary);

    const result = {
      items,
      byPaymentMethod,
      byStatus,
      totalRevenue: summary?.totalRevenue || 0,
      totalOrders: summary?.totalOrders || 0,
    };
    console.log('###result', result);
    return result;
  }
);
