import { api } from "encore.dev/api";
import db from "../db";

export interface ListLovRequest {
    category: string;
}

export const list = api(
    { method: "GET", path: "/lovs/bycategory/:category", expose: true, auth: true },
    async (req: ListLovRequest): Promise<{ values: string[] }> => {
        const result: string[] = [];
        for await (const row of db.query<{ value: string }>`
      SELECT value FROM lov WHERE category = ${req.category} ORDER BY id
    `) {
            result.push(row.value);
        }

        return { values: result };
    }
);
