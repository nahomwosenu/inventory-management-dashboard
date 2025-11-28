import { useState } from "react";
import { UserCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CurrentUser } from "../App";
import { translations } from "../lib/translations";
import { UserManagement } from "./UserManagement";
import { ItemManagement } from "./ItemManagement";
import { SalesManagement } from "./SalesManagement";
import { PurchaseRequests } from "./PurchaseRequests";
import { Reports } from "./Reports";
import { Announcements } from "./Announcements";

interface DashboardProps {
  currentUser: CurrentUser;
  onLogout: () => void;
}

export function Dashboard({ currentUser, onLogout }: DashboardProps) {
  const [lang, setLang] = useState<"en" | "am">("en");
  const t = translations[lang];

  const getAvailableTabs = () => {
    const tabs = [];
    
    if (currentUser.role === "manager") {
      tabs.push("users", "announcements", "purchases", "items", "reports");
    } else if (currentUser.role === "finance") {
      tabs.push("items", "sales", "purchases", "reports");
    } else if (currentUser.role === "store") {
      tabs.push("items", "reports");
    }
    
    return tabs;
  };

  const availableTabs = getAvailableTabs();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold">{t.inventoryDashboard}</h1>
          
          <div className="flex items-center gap-4">
            <Select value={lang} onValueChange={(v) => setLang(v as "en" | "am")}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="am">አማርኛ</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2 text-sm">
              <UserCircle className="h-5 w-5" />
              <div>
                <div className="font-medium">{currentUser.name}</div>
                <div className="text-xs text-muted-foreground">
                  {t[`role${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}` as keyof typeof t]}
                </div>
              </div>
            </div>
            
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              {t.logout}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-1 p-4">
        <Tabs defaultValue={availableTabs[0]} className="space-y-4">
          <TabsList>
            {availableTabs.includes("users") && (
              <TabsTrigger value="users">{t.users}</TabsTrigger>
            )}
            {availableTabs.includes("announcements") && (
              <TabsTrigger value="announcements">{t.announcements}</TabsTrigger>
            )}
            {availableTabs.includes("items") && (
              <TabsTrigger value="items">{t.items}</TabsTrigger>
            )}
            {availableTabs.includes("sales") && (
              <TabsTrigger value="sales">{t.sales}</TabsTrigger>
            )}
            {availableTabs.includes("purchases") && (
              <TabsTrigger value="purchases">{t.purchaseRequests}</TabsTrigger>
            )}
            {availableTabs.includes("reports") && (
              <TabsTrigger value="reports">{t.reports}</TabsTrigger>
            )}
          </TabsList>

          {availableTabs.includes("users") && (
            <TabsContent value="users">
              <UserManagement lang={lang} currentUser={currentUser} />
            </TabsContent>
          )}

          {availableTabs.includes("announcements") && (
            <TabsContent value="announcements">
              <Announcements lang={lang} currentUser={currentUser} />
            </TabsContent>
          )}

          {availableTabs.includes("items") && (
            <TabsContent value="items">
              <ItemManagement lang={lang} currentUser={currentUser} />
            </TabsContent>
          )}

          {availableTabs.includes("sales") && (
            <TabsContent value="sales">
              <SalesManagement lang={lang} currentUser={currentUser} />
            </TabsContent>
          )}

          {availableTabs.includes("purchases") && (
            <TabsContent value="purchases">
              <PurchaseRequests lang={lang} currentUser={currentUser} />
            </TabsContent>
          )}

          {availableTabs.includes("reports") && (
            <TabsContent value="reports">
              <Reports lang={lang} currentUser={currentUser} />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}
