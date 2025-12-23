import { useState, useEffect } from "react";
import backend from "~backend/client";
import type { Order } from "~backend/order/create";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Phone } from "lucide-react";

interface Item {
  id: number;
  code: string;
  name: string;
  description?: string;
  quantity: number;
  price?: number;
  createdAt: Date;
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<string[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
    item_id: "",
    quantity: "",
    payment_method: "cash" as "cash" | "bank_transfer" | "credit",
    notes: "",
  });

  useEffect(() => {
    loadOrders();
    loadItems();
    loadAddressesLov();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await backend.order.list();
      setOrders(response.orders);
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    }
  };

  const loadAddressesLov = async () => {
    try {
      const response = await backend.lov.list({ category: "addresses" });
      console.log("###addresses", response.values);
      setAddresses(response.values);
    } catch (error) {
      console.error("Failed to load addresses LOV:", error);
    }
  };

  const loadItems = async () => {
    try {
      const response = await backend.item.list();
      setItems(response.items);
    } catch (error) {
      console.error("Failed to load items:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const item = items.find((i) => i.id === parseInt(formData.item_id));
    console.log("###item", item, formData.quantity);
    if (!item || !item.quantity || parseInt(item.quantity) <= parseInt(formData.quantity)) {
      setErrors("Insufficient stock for the selected item.");
      return;
    }

    setErrors(null);

    setLoading(true);

    try {
      backend.order
        .create({
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          customer_address: formData.customer_address,
          item_id: parseInt(formData.item_id),
          quantity: parseInt(formData.quantity),
          payment_method: formData.payment_method,
          notes: formData.notes || undefined,
        })
        .then((response) => {
          console.log("###response", response);

          toast({
            title: "Success",
            description: "Order created successfully",
          });

          setIsCreateOpen(false);
          setFormData({
            customer_name: "",
            customer_email: "",
            customer_phone: "",
            customer_address: "",
            item_id: "",
            quantity: "",
            payment_method: "cash",
            notes: "",
          });
          loadOrders();
        })
        .catch((err) => {
          console.log("###err", err);
        });

      //console.log("###resp", response);
    } catch (error: any) {
      console.error("Failed to create order:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    orderId: number,
    status: "pending" | "confirmed" | "completed" | "cancelled"
  ) => {
    try {
      await backend.order.updateStatus({ order_id: orderId, status });
      toast({
        title: "Success",
        description: "Order status updated",
      });
      loadOrders();
    } catch (error: any) {
      console.error("Failed to update status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      pending: "outline",
      confirmed: "default",
      completed: "secondary",
      cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const getPaymentBadge = (method: string) => {
    const colors: Record<string, string> = {
      cash: "bg-green-500/10 text-green-500",
      bank_transfer: "bg-blue-500/10 text-blue-500",
      credit: "bg-orange-500/10 text-orange-500",
    };
    return (
      <Badge className={colors[method] || ""}>{method.replace("_", " ")}</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Order Management
          </h2>
          <p className="text-muted-foreground">
            Create and manage customer phone orders
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Phone className="mr-2 h-4 w-4" />
              New Phone Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Phone Order</DialogTitle>
              <DialogDescription>
                Enter customer order details from phone call
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer_name">Customer Name *</Label>
                  <Input
                    id="customer_name"
                    value={formData.customer_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customer_name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer_phone">Phone Number *</Label>
                  <Input
                    id="customer_phone"
                    value={formData.customer_phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customer_phone: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer_email">Email (optional)</Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer_address">Delivery Address *</Label>
                <Select
                  value={formData.customer_address}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      customer_address: value
                    })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select address" />
                  </SelectTrigger>
                  <SelectContent>
                    {addresses.map((address, index) => (
                      <SelectItem key={index} value={address}>
                        {address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item_id">Item *</Label>
                  <Select
                    value={formData.item_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, item_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                    <SelectContent>
                      {items.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name} - ${item.price || 0} (Stock:{" "}
                          {item.quantity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_method">Payment Method *</Label>
                <Select
                  value={formData.payment_method}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, payment_method: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="credit">Credit (Loan)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Additional notes or special instructions..."
                />
              </div>

              {errors && <div className="text-red-500">{errors}</div>}

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Order"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>View and manage all customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{order.customer_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.customer_phone}
                    </div>
                  </TableCell>
                  <TableCell>{order.item_name}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>
                    ${parseFloat(order.total_price.toString()).toFixed(2)}
                  </TableCell>
                  <TableCell>{getPaymentBadge(order.payment_method)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value: any) =>
                        handleStatusChange(order.id, value)
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
