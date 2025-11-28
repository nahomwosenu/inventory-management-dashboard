import { api } from "encore.dev/api";
import db from "../db";

export interface CreatePurchaseRequest {
  itemName: string;
  itemCode?: string;
  quantity: number;
  estimatedPrice?: number;
  notes?: string;
  requestedBy: number;
}

export interface PurchaseRequest {
  id: number;
  itemName: string;
  itemCode?: string;
  quantity: number;
  estimatedPrice?: number;
  status: string;
  requestedBy: number;
  approvedBy?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Creates a new purchase request.
export const create = api<CreatePurchaseRequest, PurchaseRequest>(
  { expose: true, method: "POST", path: "/purchase-requests", auth: true },
  async (req) => {
    const purchaseRequest = await db.queryRow<PurchaseRequest>`
      INSERT INTO purchase_requests (item_name, item_code, quantity, estimated_price, notes, requested_by)
      VALUES (${req.itemName}, ${req.itemCode || null}, ${req.quantity}, ${req.estimatedPrice || null}, ${req.notes || null}, ${req.requestedBy})
      RETURNING id, item_name as "itemName", item_code as "itemCode", quantity, 
                estimated_price as "estimatedPrice", status, requested_by as "requestedBy",
                approved_by as "approvedBy", notes, created_at as "createdAt", updated_at as "updatedAt"
    `;
    
    if (!purchaseRequest) {
      throw new Error("Failed to create purchase request");
    }
    
    return purchaseRequest;
  }
);
