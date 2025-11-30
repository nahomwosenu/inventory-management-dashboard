import { Header, APIError, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";

// ----------------------
// Sample User Data
// ----------------------

interface User {
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
  if (!data.authorization) {
    throw APIError.unauthenticated("Missing Authorization header");
  }

  if (!data.authorization.startsWith("Basic ")) {
    throw APIError.unauthenticated("Invalid auth format. Use Basic auth.");
  }

  const base64Credentials = data.authorization.replace("Basic ", "");
  const decoded = Buffer.from(base64Credentials, "base64").toString("utf8");

  const [phone, password] = decoded.split(":");

  if (!phone || !password) {
    throw APIError.unauthenticated("Invalid credentials format");
  }

  // Find user
  const user = sampleUsers.find(
    (u) => u.phone === phone && u.password === password
  );

  if (!user) {
    throw APIError.unauthenticated("Invalid phone or password");
  }

  // Successful auth
  return {
    userID: user.phone, // unique ID
    name: user.name,
    phone: user.phone,
    role: user.role,
  };
});

// Attach to API Gateway
export const gw = new Gateway({ authHandler: auth });
