import { Header, APIError, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import db from "../db";

// ----------------------
// Sample User Data
// ----------------------

interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
}

const sampleUsers: User[] = [
  {
    name: "mohan",
    email: "mohan@gmail.com",
    password: "123456",
    phone: "0938971714",
    role: "manager",
  },
  {
    name: "henok",
    email: "henok@gmail.com",
    password: "123456",
    phone: "0965290133",
    role: "finance",
  },
  {
    name: "teferi",
    email: "teferi@gmail.com",
    password: "123456",
    phone: "0911755523",
    role: "store",
  },
];

// ----------------------
// Auth Types
// ----------------------

interface AuthParams {
  authorization?: Header<"Authorization">;
}

export interface AuthData {
  userID: string;
  name: string;
  phone: string;
  role: string;
}

// ----------------------
// Basic Auth Handler
// ----------------------

// Expected Authorization header format:
//   Authorization: Basic base64("phone:password")

export const auth = authHandler<AuthParams, AuthData>(async (data) => {
  // If no Authorization header provided, allow access for this PoC
  if (!data.authorization) {
    const defaultUser = sampleUsers[0];
    return {
      userID: defaultUser.phone,
      name: defaultUser.name,
      phone: defaultUser.phone,
      role: defaultUser.role,
    };
  }

  // If an Authorization header is present, still support Basic auth
  if (!data.authorization.startsWith("Basic ")) {
    throw APIError.unauthenticated("Invalid auth format. Use Basic auth.");
  }

  const base64Credentials = data.authorization.replace("Basic ", "");
  const decoded = (globalThis as any).Buffer
    ? (globalThis as any).Buffer.from(base64Credentials, "base64").toString(
        "utf8"
      )
    : (globalThis as any).atob
    ? (globalThis as any).atob(base64Credentials)
    : (() => {
        throw APIError.unauthenticated("Base64 decode not available");
      })();

  const [phone, password] = decoded.split(":");

  if (!phone || !password) {
    throw APIError.unauthenticated("Invalid credentials format");
  }

  // Find user
  /* const user = sampleUsers.find(
    (u) => u.phone === phone && u.password === password
  ); */
  // lookup this user by phone & password
  const user =
    await db.queryRow`SELECT * FROM users WHERE phone_number = ${phone} AND password = ${password}`;

  if (!user) {
    throw APIError.unauthenticated("Invalid phone or password");
  }

  console.log("user", user);

  // Successful auth
  return {
    ...user,
    userID: user.phone_number, // unique ID
    name: user.name,
    phone: user.phone_number,
    role: user.role,
  };
});

// Attach to API Gateway
export const gw = new Gateway({ authHandler: auth });
