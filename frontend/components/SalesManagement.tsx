import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
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

interface SalesManagementProps {
  lang: "en" | "am";
  currentUser: CurrentUser;
}

export function SalesManagement({ lang, currentUser }: SalesManagementProps) {
  const [sales, setSales] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    itemId: "",
    quantity: 0,
    unitPrice: 0,
    saleDate: new Date().toISOString().split("T")[0],
  });
  const { toast } = useToast();
  const t = translations[lang];

  useEffect(() => {
    loadSales();
    loadItems();
  }, []);

  const loadSales = async () => {
    try {
      const { sales } = await backend.sale.list({});
      setSales(sales);
    } catch (error) {
      console.error("Failed to load sales:", error);
      toast({ title: t.error, description: t.failedToLoadSales, variant: "destructive" });
    }
  };

  const loadItems = async () => {
    try {
      const { items } = await backend.item.list();
      setItems(items);
    } catch (error) {
      console.error("Failed to load items:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await backend.sale.register({
        itemId: parseInt(formData.itemId),
        quantity: formData.quantity,
        unitPrice: formData.unitPrice,
        saleDate: new Date(formData.saleDate),
        createdBy: currentUser.id,
      });
      
      toast({ title: t.success, description: t.saleRegistered });
      setDialogOpen(false);
      setFormData({
        itemId: "",
        quantity: 0,
        unitPrice: 0,
        saleDate: new Date().toISOString().split("T")[0],
      });
      loadSales();
      loadItems();
    } catch (error: any) {
      console.error("Failed to register sale:", error);
      toast({ 
        title: t.error, 
        description: error.message || t.failedToRegisterSale,
        variant: "destructive" 
      });
    }
  };

  const selectedItem = items.find(item => item.id === parseInt(formData.itemId));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t.salesManagement}</CardTitle>
            <CardDescription>{t.registerSales}</CardDescription>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t.registerSale}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.date}</TableHead>
              <TableHead>{t.code}</TableHead>
              <TableHead>{t.item}</TableHead>
              <TableHead>{t.quantity}</TableHead>
              <TableHead>{t.unitPrice}</TableHead>
              <TableHead>{t.total}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                <TableCell>{sale.itemCode}</TableCell>
                <TableCell>{sale.itemName}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>{sale.unitPrice.toFixed(2)} ETB</TableCell>
                <TableCell>{sale.totalPrice.toFixed(2)} ETB</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.registerSale}</DialogTitle>
              <DialogDescription>{t.registerSaleDescription}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="item">{t.item}</Label>
                  <Select value={formData.itemId} onValueChange={(v) => {
                    const item = items.find(i => i.id === parseInt(v));
                    setFormData({ 
                      ...formData, 
                      itemId: v,
                      unitPrice: item?.price || 0
                    });
                  }}>
                    <SelectTrigger id="item">
                      <SelectValue placeholder={t.selectItem} />
                    </SelectTrigger>
                    <SelectContent>
                      {items.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.code} - {item.name} ({t.available}: {item.quantity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">{t.quantity}</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={selectedItem?.quantity || 999999}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    required
                  />
                  {selectedItem && (
                    <p className="text-sm text-muted-foreground">
                      {t.available}: {selectedItem.quantity}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unitPrice">{t.unitPrice}</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="saleDate">{t.saleDate}</Label>
                  <Input
                    id="saleDate"
                    type="date"
                    value={formData.saleDate}
                    onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
                    required
                  />
                </div>
                
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm font-medium">{t.total}: {(formData.quantity * formData.unitPrice).toFixed(2)} ETB</p>
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
