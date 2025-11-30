import { use, useEffect, useState } from "react";

export interface User {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "manager" | "finance" | "store";
}

const sampleUsers = [
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
] as User[];

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  const saveLogin = (user: User) => {
    setUser(user);
  };

  const login = (email: string, password: string, role: string) => {
    if (!email || !password || !role) return false;
    const findUser = sampleUsers.find(
      (user) =>
        user.email === email && user.password === password && user.role === role
    );
    if (!findUser) return false;
    saveLogin(findUser);
    localStorage.setItem("user", JSON.stringify({ email, password, role }));
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

  return { user, login, logout, getSavedLogin };
};
