import { api } from "encore.dev/api";
import db from "../db";

export interface CreateUserRequest {
  phoneNumber: string;
  name: string;
  password: string;
  role: "manager" | "finance" | "store";
}

export interface User {
  id: number;
  phoneNumber: string;
  name: string;
  role: string;
  password: string;
  createdAt: Date;
}

// Creates a new user.
export const create = api<CreateUserRequest, User>(
  { expose: true, method: "POST", path: "/users", auth: true },
  async (req) => {
    const user = await db.queryRow<User>`
      INSERT INTO users (phone_number, name, role, password)
      VALUES (${req.phoneNumber}, ${req.name}, ${req.role}, ${req.password})
      RETURNING id, phone_number as "phoneNumber", name, role, created_at as "createdAt"
    `;

    if (!user) {
      throw new Error("Failed to create user");
    }

    return user;
  }
);
