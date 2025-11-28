import { useState } from "react";
import { ClerkProvider } from '@clerk/clerk-react';
import { Toaster } from "@/components/ui/toaster";
import { Dashboard } from "./components/Dashboard";
import { LoginPage } from "./components/LoginPage";

const PUBLISHABLE_KEY = "pk_test_bWFnaWNhbC1tb25hcmNoLTE3LmNsZXJrLmFjY291bnRzLmRldiQ";

export interface CurrentUser {
  id: number;
  name: string;
  phoneNumber: string;
  role: "manager" | "finance" | "store";
}

function AppInner() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  if (!currentUser) {
    return <LoginPage onLogin={setCurrentUser} />;
  }

  return (
    <div className="dark min-h-screen bg-background">
      <Dashboard currentUser={currentUser} onLogout={() => setCurrentUser(null)} />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AppInner />
    </ClerkProvider>
  );
}
