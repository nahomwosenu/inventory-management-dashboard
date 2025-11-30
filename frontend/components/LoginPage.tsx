import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CurrentUser } from "../App";
import { translations } from "../lib/translations";
import { useAuth } from "@/context/auth";

export function LoginPage() {
  const [lang, setLang] = useState<"en" | "am">("en");
  const [role, setRole] = useState<"manager" | "finance" | "store">("manager");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const t = translations[lang];
  const { login, user, getSavedLogin } = useAuth();

  useEffect(() => {
    getSavedLogin();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const loginUser = {
      password,
      phoneNumber,
      role,
    };
    console.log("Attempting login with", loginUser);
    if (login(loginUser.phoneNumber, loginUser.password, loginUser.role)) {
      alert(`Logged in as ${loginUser.role}`);
      window.location.href = '/dashboard';
    } else {
      alert(`Invalid credentials for ${loginUser.phoneNumber}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{t.login}</CardTitle>
            <Select
              value={lang}
              onValueChange={(v) => setLang(v as "en" | "am")}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="am">አማርኛ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardDescription>{t.loginDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">{t.phoneNumber}</Label>
              <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+251..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">{t.password}</Label>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.password}
                type="password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">{t.role}</Label>
              <Select value={role} onValueChange={(v) => setRole(v as any)}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">{t.roleManager}</SelectItem>
                  <SelectItem value="finance">{t.roleFinance}</SelectItem>
                  <SelectItem value="store">{t.roleStore}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              {t.login}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
