import { api, APIError } from "encore.dev/api";
import db from "../db";
import type { PurchaseRequest } from "./create";

export interface ApprovePurchaseRequest {
  id: number;
  approvedBy: number;
  status: "approved" | "denied";
}

// Approves or denies a purchase request.
export const approve = api<ApprovePurchaseRequest, PurchaseRequest>(
  { expose: true, method: "PUT", path: "/purchase-requests/:id/approve", auth: true },
  async (req) => {
    const purchaseRequest = await db.queryRow<PurchaseRequest>`
      UPDATE purchase_requests
      SET status = ${req.status}, approved_by = ${req.approvedBy}, updated_at = NOW()
      WHERE id = ${req.id}
      RETURNING id, item_name as "itemName", item_code as "itemCode", quantity,
                estimated_price as "estimatedPrice", status, requested_by as "requestedBy",
                approved_by as "approvedBy", notes, created_at as "createdAt", updated_at as "updatedAt"
    `;
    
    if (!purchaseRequest) {
      throw APIError.notFound("Purchase request not found");
    }
    
    return purchaseRequest;
  }
);
