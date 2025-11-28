import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import db from "../db";

export interface PurchaseRequestWithUsers {
  id: number;
  itemName: string;
  itemCode?: string;
  quantity: number;
  estimatedPrice?: number;
  status: string;
  requestedBy: number;
  requestedByName: string;
  approvedBy?: number;
  approvedByName?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListPurchaseRequestsRequest {
  status?: Query<string>;
}

export interface ListPurchaseRequestsResponse {
  requests: PurchaseRequestWithUsers[];
}

// Retrieves purchase requests with optional status filtering.
export const list = api<ListPurchaseRequestsRequest, ListPurchaseRequestsResponse>(
  { expose: true, method: "GET", path: "/purchase-requests", auth: true },
  async (req) => {
    let query = `
      SELECT pr.id, pr.item_name as "itemName", pr.item_code as "itemCode",
             pr.quantity, pr.estimated_price as "estimatedPrice", pr.status,
             pr.requested_by as "requestedBy", u1.name as "requestedByName",
             pr.approved_by as "approvedBy", u2.name as "approvedByName",
             pr.notes, pr.created_at as "createdAt", pr.updated_at as "updatedAt"
      FROM purchase_requests pr
      JOIN users u1 ON pr.requested_by = u1.id
      LEFT JOIN users u2 ON pr.approved_by = u2.id
    `;
    
    const params: any[] = [];
    
    if (req.status) {
      query += ` WHERE pr.status = $1`;
      params.push(req.status);
    }
    
    query += ` ORDER BY pr.created_at DESC`;
    
    const requests = await db.rawQueryAll<PurchaseRequestWithUsers>(query, ...params);
    
    return { requests };
  }
);
