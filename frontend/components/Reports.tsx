import { useState, useEffect } from "react";
import { FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";
import type { CurrentUser } from "../App";
import { translations } from "../lib/translations";

interface ReportsProps {
  lang: "en" | "am";
  currentUser: CurrentUser;
}

export function Reports({ lang, currentUser }: ReportsProps) {
  const [period, setPeriod] = useState("daily");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [salesReport, setSalesReport] = useState<any>(null);
  const [purchaseReport, setPurchaseReport] = useState<any>(null);
  const [inventoryReport, setInventoryReport] = useState<any>(null);
  const { toast } = useToast();
  const t = translations[lang];

  useEffect(() => {
    updateDates();
  }, [period]);

  useEffect(() => {
    loadInventoryReport();
  }, []);

  const updateDates = () => {
    const today = new Date();
    const end = today.toISOString().split("T")[0];
    
    let start: Date;
    if (period === "daily") {
      start = today;
    } else if (period === "weekly") {
      start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
      start = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end);
  };

  const loadSalesReport = async () => {
    try {
      const report = await backend.report.sales({ startDate, endDate });
      setSalesReport(report);
    } catch (error) {
      console.error("Failed to load sales report:", error);
      toast({ title: t.error, description: t.failedToLoadReport, variant: "destructive" });
    }
  };

  const loadPurchaseReport = async () => {
    try {
      const report = await backend.report.purchase({ startDate, endDate });
      setPurchaseReport(report);
    } catch (error) {
      console.error("Failed to load purchase report:", error);
      toast({ title: t.error, description: t.failedToLoadReport, variant: "destructive" });
    }
  };

  const loadInventoryReport = async () => {
    try {
      const report = await backend.report.inventory();
      setInventoryReport(report);
    } catch (error) {
      console.error("Failed to load inventory report:", error);
      toast({ title: t.error, description: t.failedToLoadReport, variant: "destructive" });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t.reports}</CardTitle>
            <CardDescription>{t.viewReports}</CardDescription>
          </div>
          <Button onClick={handlePrint} variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            {t.print}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-4">
          <div className="flex-1 space-y-2">
            <Label>{t.period}</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">{t.daily}</SelectItem>
                <SelectItem value="weekly">{t.weekly}</SelectItem>
                <SelectItem value="monthly">{t.monthly}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 space-y-2">
            <Label>{t.startDate}</Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          
          <div className="flex-1 space-y-2">
            <Label>{t.endDate}</Label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        <Tabs defaultValue="sales" className="mt-4">
          <TabsList>
            <TabsTrigger value="sales">{t.salesReport}</TabsTrigger>
            <TabsTrigger value="purchase">{t.purchaseReport}</TabsTrigger>
            <TabsTrigger value="inventory">{t.inventoryReport}</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-4">
            <Button onClick={loadSalesReport}>
              <FileText className="mr-2 h-4 w-4" />
              {t.generateReport}
            </Button>
            
            {salesReport && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">{t.totalRevenue}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{salesReport.totalRevenue.toFixed(2)} ETB</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">{t.totalSales}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{salesReport.totalSales}</p>
                    </CardContent>
                  </Card>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.code}</TableHead>
                      <TableHead>{t.item}</TableHead>
                      <TableHead>{t.quantity}</TableHead>
                      <TableHead>{t.revenue}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesReport.items.map((item: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell>{item.itemCode}</TableCell>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.totalQuantity}</TableCell>
                        <TableCell>{item.totalRevenue.toFixed(2)} ETB</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </TabsContent>

          <TabsContent value="purchase" className="space-y-4">
            <Button onClick={loadPurchaseReport}>
              <FileText className="mr-2 h-4 w-4" />
              {t.generateReport}
            </Button>
            
            {purchaseReport && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">{t.totalEstimatedCost}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{purchaseReport.totalEstimatedCost.toFixed(2)} ETB</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">{t.totalRequests}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{purchaseReport.totalRequests}</p>
                    </CardContent>
                  </Card>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.itemName}</TableHead>
                      <TableHead>{t.code}</TableHead>
                      <TableHead>{t.quantity}</TableHead>
                      <TableHead>{t.estimatedCost}</TableHead>
                      <TableHead>{t.approved}</TableHead>
                      <TableHead>{t.denied}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseReport.items.map((item: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.itemCode || "-"}</TableCell>
                        <TableCell>{item.totalQuantity}</TableCell>
                        <TableCell>{item.totalEstimatedCost.toFixed(2)} ETB</TableCell>
                        <TableCell>{item.approvedCount}</TableCell>
                        <TableCell>{item.deniedCount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            {inventoryReport && (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">{t.totalItems}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{inventoryReport.totalItems}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">{t.totalValue}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{inventoryReport.totalValue.toFixed(2)} ETB</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">{t.itemsAddedToday}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{inventoryReport.itemsAddedToday}</p>
                    </CardContent>
                  </Card>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.code}</TableHead>
                      <TableHead>{t.name}</TableHead>
                      <TableHead>{t.quantity}</TableHead>
                      <TableHead>{t.price}</TableHead>
                      <TableHead>{t.value}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryReport.items.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.code}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.price ? `${item.price.toFixed(2)} ETB` : "-"}</TableCell>
                        <TableCell>{item.totalValue.toFixed(2)} ETB</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
