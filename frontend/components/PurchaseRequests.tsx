import { useState, useEffect } from "react";
import { Plus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";
import type { CurrentUser } from "../App";
import { translations } from "../lib/translations";

interface PurchaseRequestsProps {
  lang: "en" | "am";
  currentUser: CurrentUser;
}

export function PurchaseRequests({ lang, currentUser }: PurchaseRequestsProps) {
  const [requests, setRequests] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    itemName: "",
    itemCode: "",
    quantity: 0,
    estimatedPrice: 0,
    notes: "",
  });
  const { toast } = useToast();
  const t = translations[lang];

  const canCreate = currentUser.role === "finance";
  const canApprove = currentUser.role === "manager";

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const { requests } = await backend.purchase.list({});
      setRequests(requests);
    } catch (error) {
      console.error("Failed to load purchase requests:", error);
      toast({ title: t.error, description: t.failedToLoadPurchaseRequests, variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await backend.purchase.create({
        ...formData,
        requestedBy: currentUser.id,
      });
      
      toast({ title: t.success, description: t.purchaseRequestCreated });
      setDialogOpen(false);
      setFormData({
        itemName: "",
        itemCode: "",
        quantity: 0,
        estimatedPrice: 0,
        notes: "",
      });
      loadRequests();
    } catch (error) {
      console.error("Failed to create purchase request:", error);
      toast({ title: t.error, description: t.failedToCreatePurchaseRequest, variant: "destructive" });
    }
  };

  const handleApprove = async (id: number, status: "approved" | "denied") => {
    try {
      await backend.purchase.approve({
        id,
        approvedBy: currentUser.id,
        status,
      });
      
      toast({ 
        title: t.success, 
        description: status === "approved" ? t.purchaseRequestApproved : t.purchaseRequestDenied 
      });
      loadRequests();
    } catch (error) {
      console.error("Failed to update purchase request:", error);
      toast({ title: t.error, description: t.failedToUpdatePurchaseRequest, variant: "destructive" });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      approved: "default",
      denied: "destructive",
    };
    
    return <Badge variant={variants[status]}>{t[status as keyof typeof t]}</Badge>;
  };

  const pendingRequests = requests.filter(r => r.status === "pending");
  const approvedRequests = requests.filter(r => r.status === "approved");
  const deniedRequests = requests.filter(r => r.status === "denied");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t.purchaseRequests}</CardTitle>
            <CardDescription>{t.managePurchaseRequests}</CardDescription>
          </div>
          {canCreate && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t.newPurchaseRequest}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">{t.pending} ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="approved">{t.approved} ({approvedRequests.length})</TabsTrigger>
            <TabsTrigger value="denied">{t.denied} ({deniedRequests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            <RequestsTable 
              requests={pendingRequests} 
              canApprove={canApprove}
              onApprove={handleApprove}
              getStatusBadge={getStatusBadge}
              t={t}
            />
          </TabsContent>

          <TabsContent value="approved" className="mt-4">
            <RequestsTable 
              requests={approvedRequests} 
              canApprove={false}
              onApprove={handleApprove}
              getStatusBadge={getStatusBadge}
              t={t}
            />
          </TabsContent>

          <TabsContent value="denied" className="mt-4">
            <RequestsTable 
              requests={deniedRequests} 
              canApprove={false}
              onApprove={handleApprove}
              getStatusBadge={getStatusBadge}
              t={t}
            />
          </TabsContent>
        </Tabs>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.newPurchaseRequest}</DialogTitle>
              <DialogDescription>{t.createPurchaseRequestDescription}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="itemName">{t.itemName}</Label>
                  <Input
                    id="itemName"
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="itemCode">{t.code}</Label>
                  <Input
                    id="itemCode"
                    value={formData.itemCode}
                    onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
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
                  <Label htmlFor="estimatedPrice">{t.estimatedPrice}</Label>
                  <Input
                    id="estimatedPrice"
                    type="number"
                    step="0.01"
                    value={formData.estimatedPrice}
                    onChange={(e) => setFormData({ ...formData, estimatedPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">{t.notes}</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>
              
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>{t.cancel}</Button>
                <Button type="submit">{t.submit}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function RequestsTable({ 
  requests, 
  canApprove, 
  onApprove, 
  getStatusBadge, 
  t 
}: { 
  requests: any[]; 
  canApprove: boolean; 
  onApprove: (id: number, status: "approved" | "denied") => void;
  getStatusBadge: (status: string) => React.ReactNode;
  t: any;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t.itemName}</TableHead>
          <TableHead>{t.code}</TableHead>
          <TableHead>{t.quantity}</TableHead>
          <TableHead>{t.estimatedPrice}</TableHead>
          <TableHead>{t.requestedBy}</TableHead>
          <TableHead>{t.status}</TableHead>
          {canApprove && <TableHead>{t.actions}</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>{request.itemName}</TableCell>
            <TableCell>{request.itemCode || "-"}</TableCell>
            <TableCell>{request.quantity}</TableCell>
            <TableCell>{request.estimatedPrice ? `${request.estimatedPrice.toFixed(2)} ETB` : "-"}</TableCell>
            <TableCell>{request.requestedByName}</TableCell>
            <TableCell>{getStatusBadge(request.status)}</TableCell>
            {canApprove && (
              <TableCell className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => onApprove(request.id, "approved")}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => onApprove(request.id, "denied")}>
                  <X className="h-4 w-4" />
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
