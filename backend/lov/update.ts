import { api } from "encore.dev/api";
import db from "../db";

export interface UpdateLovRequest {
    lov_id: number;
    value: string;
}

export interface Lov {
    id: number;
    category: string;
    value: string;
    created_by_user_id: number | null;
    created_at: Date;
}

export const update = api(
    { method: "POST", path: "/lovs/:lov_id", expose: true, auth: true },
    async (req: UpdateLovRequest): Promise<Lov> => {
        const lov = await db.queryRow<Lov>`
      UPDATE lov
      SET value = ${req.value}
      WHERE id = ${req.lov_id}
      RETURNING *
    `;

        if (!lov) {
            throw new Error("LOV not found");
        }

        return lov;
    }
);
