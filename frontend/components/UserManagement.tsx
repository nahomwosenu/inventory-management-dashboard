import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";
import type { CurrentUser } from "../App";
import { translations } from "../lib/translations";

interface UserManagementProps {
  lang: "en" | "am";
  currentUser: CurrentUser;
}

export function UserManagement({ lang, currentUser }: UserManagementProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({ phoneNumber: "", name: "", role: "store" as "manager" | "finance" | "store" });
  const { toast } = useToast();
  const t = translations[lang];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { users } = await backend.user.list();
      setUsers(users);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast({ title: t.error, description: t.failedToLoadUsers, variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        await backend.user.update({ id: editingUser.id, ...formData });
        toast({ title: t.success, description: t.userUpdated });
      } else {
        await backend.user.create(formData);
        toast({ title: t.success, description: t.userCreated });
      }
      
      setDialogOpen(false);
      setEditingUser(null);
      setFormData({ phoneNumber: "", name: "", role: "store" });
      loadUsers();
    } catch (error) {
      console.error("Failed to save user:", error);
      toast({ title: t.error, description: t.failedToSaveUser, variant: "destructive" });
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({ phoneNumber: user.phoneNumber, name: user.name, role: user.role });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t.confirmDelete)) return;
    
    try {
      await backend.user.deleteUser({ id });
      toast({ title: t.success, description: t.userDeleted });
      loadUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast({ title: t.error, description: t.failedToDeleteUser, variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t.userManagement}</CardTitle>
            <CardDescription>{t.manageUsers}</CardDescription>
          </div>
          <Button onClick={() => { setEditingUser(null); setFormData({ phoneNumber: "", name: "", role: "store" }); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            {t.addUser}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.name}</TableHead>
              <TableHead>{t.phoneNumber}</TableHead>
              <TableHead>{t.role}</TableHead>
              <TableHead>{t.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{t[`role${user.role.charAt(0).toUpperCase() + user.role.slice(1)}` as keyof typeof t]}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(user.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? t.editUser : t.addUser}</DialogTitle>
              <DialogDescription>{editingUser ? t.editUserDescription : t.addUserDescription}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t.name}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">{t.phoneNumber}</Label>
                  <Input
                    id="phone"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+251..."
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">{t.role}</Label>
                  <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as any })}>
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
              </div>
              
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>{t.cancel}</Button>
                <Button type="submit">{t.save}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
