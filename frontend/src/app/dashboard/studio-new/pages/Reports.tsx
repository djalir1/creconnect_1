"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, FileText, Loader2 } from "lucide-react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

export default function Reports() {
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const {
    data: reportData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reports", startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, clients(name), payments(*)")
        .gte("booking_date", startDate)
        .lte("booking_date", endDate)
        .order("booking_date", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
    enabled: Boolean(startDate && endDate),
  });

  const totalRevenue = reportData.reduce(
    (sum: number, booking: any) =>
      sum + Number(booking.payments?.[0]?.amount || 0),
    0
  );

  const handleExportCSV = () => {
    if (!reportData.length) {
      toast.warning("No data to export");
      return;
    }

    const csv = [
      ["Date", "Client", "Type", "Amount", "Status"],
      ...reportData.map((b: any) => [
        format(new Date(b.booking_date), "yyyy-MM-dd"),
        b.clients?.name ?? "N/A",
        b.booking_type ?? "—",
        Number(b.payments?.[0]?.amount || 0),
        b.payments?.[0]?.payment_status ?? "N/A",
      ]),
    ]
      .map((r) => r.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `report_${startDate}_to_${endDate}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleExportPDF = () => {
    if (!reportData.length) {
      toast.warning("No data to export");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Studio Report", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Date", "Client", "Type", "Amount", "Status"]],
      body: reportData.map((b: any) => [
        format(new Date(b.booking_date), "MMM dd, yyyy"),
        b.clients?.name ?? "—",
        b.booking_type ?? "—",
        Number(b.payments?.[0]?.amount || 0).toLocaleString(),
        b.payments?.[0]?.payment_status ?? "UNPAID",
      ]),
    });

    doc.save(`report_${startDate}_to_${endDate}.pdf`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reports</h1>

      <Card>
        <CardHeader>
          <CardTitle>Date Range</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div>
            <Label>Start</Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <Label>End</Label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <Button onClick={handleExportCSV} disabled={isLoading}>CSV</Button>
          <Button onClick={handleExportPDF} disabled={isLoading}>PDF</Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : error ? (
        <p className="text-destructive">Failed to load report</p>
      ) : (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((b: any) => (
                  <TableRow key={b.id}>
                    <TableCell>{format(new Date(b.booking_date), "MMM dd, yyyy")}</TableCell>
                    <TableCell>{b.clients?.name}</TableCell>
                    <TableCell>{b.booking_type}</TableCell>
                    <TableCell className="text-right">
                      {Number(b.payments?.[0]?.amount || 0).toLocaleString()} RWF
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell colSpan={3} className="text-right">Total</TableCell>
                  <TableCell className="text-right">
                    {totalRevenue.toLocaleString()} RWF
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
