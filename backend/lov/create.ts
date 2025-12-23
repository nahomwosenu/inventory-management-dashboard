import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

export interface CreateLovRequest {
    category: string;
    value: string;
}

export interface Lov {
    id: number;
    category: string;
    value: string;
    created_by_user_id: number | null;
    created_at: Date;
}

export const create = api(
    { method: "POST", path: "/lovs", expose: true, auth: true },
    async (req: CreateLovRequest): Promise<Lov> => {
        const auth = getAuthData()!;

        const lov = await db.queryRow<Lov>`
      INSERT INTO lov (category, value, created_by_user_id)
      VALUES (
        ${req.category},
        ${req.value},
        ${Number(auth?.id) || 2}
      )
      RETURNING *
    `;

        return lov!;
    }
);
