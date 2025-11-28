import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";
import type { CurrentUser } from "../App";
import { translations } from "../lib/translations";

interface ItemManagementProps {
  lang: "en" | "am";
  currentUser: CurrentUser;
}

export function ItemManagement({ lang, currentUser }: ItemManagementProps) {
  const [items, setItems] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ code: "", name: "", description: "", quantity: 0, price: 0 });
  const { toast } = useToast();
  const t = translations[lang];

  const canAdd = currentUser.role === "store";
  const canEdit = currentUser.role === "manager" || currentUser.role === "finance";
  const canDelete = currentUser.role === "store";

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const { items } = await backend.item.list();
      setItems(items);
    } catch (error) {
      console.error("Failed to load items:", error);
      toast({ title: t.error, description: t.failedToLoadItems, variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        await backend.item.update({ id: editingItem.id, ...formData });
        toast({ title: t.success, description: t.itemUpdated });
      } else {
        await backend.item.create(formData);
        toast({ title: t.success, description: t.itemCreated });
      }
      
      setDialogOpen(false);
      setEditingItem(null);
      setFormData({ code: "", name: "", description: "", quantity: 0, price: 0 });
      loadItems();
    } catch (error) {
      console.error("Failed to save item:", error);
      toast({ title: t.error, description: t.failedToSaveItem, variant: "destructive" });
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description || "",
      quantity: item.quantity,
      price: item.price || 0,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t.confirmDelete)) return;
    
    try {
      await backend.item.deleteItem({ id });
      toast({ title: t.success, description: t.itemDeleted });
      loadItems();
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast({ title: t.error, description: t.failedToDeleteItem, variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t.itemManagement}</CardTitle>
            <CardDescription>{t.manageItems}</CardDescription>
          </div>
          {canAdd && (
            <Button onClick={() => { setEditingItem(null); setFormData({ code: "", name: "", description: "", quantity: 0, price: 0 }); setDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              {t.addItem}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.code}</TableHead>
              <TableHead>{t.name}</TableHead>
              <TableHead>{t.quantity}</TableHead>
              <TableHead>{t.price}</TableHead>
              <TableHead>{t.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.price ? `${item.price.toFixed(2)} ETB` : "-"}</TableCell>
                <TableCell className="space-x-2">
                  {canEdit && (
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {canDelete && (
                    <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? t.editItem : t.addItem}</DialogTitle>
              <DialogDescription>{editingItem ? t.editItemDescription : t.addItemDescription}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">{t.code}</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                    disabled={!!editingItem}
                  />
                </div>
                
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
                  <Label htmlFor="description">{t.description}</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">{t.quantity}</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">{t.price}</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  />
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
