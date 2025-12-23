import { useBackend } from "@/lib/backend";
import { useEffect, useState } from "react";

export interface User {
  name?: string;
  email?: string;
  password: string;
  phone: string;
  role: "manager" | "finance" | "store";
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  const saveLogin = (u: User) => {
    setUser(u);
  };

  const getUserToken = () => {
    if (!user) return undefined;
    // return base64 of phone:password for Basic auth
    return btoa(`${user.phone}:${user.password}`);
  };

  const login = (phone: string, password: string, role: User["role"]) => {
    if (!phone || !password || !role) return false;
    const newUser: User = { phone, password, role, name: undefined, email: undefined };
    saveLogin(newUser);
    // Save full user so the app can restore state including name/email
    localStorage.setItem("user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const getSavedLogin = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const u = JSON.parse(savedUser) as User;
      setUser(u);
    }
  };

  useEffect(() => {
    getSavedLogin();
  }, []);

  return { user, login, logout, getSavedLogin, getUserToken };
};
