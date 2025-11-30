import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Dashboard } from "./components/Dashboard";
import { LoginPage } from "./components/LoginPage";
import { useAuth } from "./context/auth";

const PUBLISHABLE_KEY = "pk_test_bWFnaWNhbC1tb25hcmNoLTE3LmNsZXJrLmFjY291bnRzLmRldiQ";

export interface CurrentUser {
  id: number;
  name: string;
  phoneNumber: string;
  role: "manager" | "finance" | "store";
}

function AppInner() {
  const { user: currentUser, logout } = useAuth();

  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="dark min-h-screen bg-background">
      <Dashboard currentUser={currentUser} onLogout={() => logout()} />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AppInner />
  );
}
