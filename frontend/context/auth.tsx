import { useBackend } from "@/lib/backend";
import { use, useEffect, useState } from "react";

export interface User {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "manager" | "finance" | "store";
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  const saveLogin = (user: User) => {
    setUser(user);
  };

  const getUserToken = () => {
    if (!user) return undefined;
    // return base64 of phone:password for Basic auth
    return btoa(`${user.phone}:${user.password}`);
  };

  const login = (phone: string, password: string, role: string) => {
    if (!phone || !password || !role) return false;
    setUser({
      phone,
      password,
      role,
    });
    if (!findUser) return false;
    saveLogin(findUser);
    // Save full user so the app can restore state including name/email
    localStorage.setItem("user", JSON.stringify(findUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const getSavedLogin = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUser(user);
    }
  };

  useEffect(() => {
    getSavedLogin();
  }, []);

  return { user, login, logout, getSavedLogin, getUserToken };
};
