'use client';

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, AlertCircle, FileText } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const StyledInput = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={cn(
      "flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-base shadow-sm transition-all duration-200",
      "placeholder:text-slate-400 text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
      className
    )}
  />
);

export default function Payments() {
  const [paymentsList, setPaymentsList] = useState<any[]>([]);
  const [availableBookings, setAvailableBookings] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    booking_id: "",
    amount: "",
    payment_status: "pending",
    payment_date: new Date().toISOString().split("T")[0],
    payment_method: "",
    notes: "", // Notes is initialized here
  });

  // Load data on mount and when dialog opens
  useEffect(() => {
    const storedPayments = JSON.parse(localStorage.getItem("local_payments_data") || "[]");
    setPaymentsList(storedPayments);

    // Try all possible keys where your bookings might be hiding
    const rawBookings = 
      localStorage.getItem("local_bookings") || 
      localStorage.getItem("bookings") || 
      localStorage.getItem("bookings_data");
    
    if (rawBookings) {
      setAvailableBookings(JSON.parse(rawBookings));
    }
  }, [open]);

  useEffect(() => {
    localStorage.setItem("local_payments_data", JSON.stringify(paymentsList));
  }, [paymentsList]);

  // Optimized filtering for large datasets
  const filteredPayments = useMemo(() => {
    return paymentsList.filter(p => 
      (p.client_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
      (p.payment_method?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (p.notes?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );
  }, [paymentsList, searchTerm]);

  const resetForm = () => {
    setFormData({
      booking_id: "",
      amount: "",
      payment_status: "pending",
      payment_date: new Date().toISOString().split("T")[0],
      payment_method: "",
      notes: "",
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedBooking = availableBookings.find(b => b.id === formData.booking_id);

    const paymentEntry = {
      ...formData,
      id: editingId || Math.random().toString(36).substr(2, 9),
      client_name: selectedBooking?.guestName || selectedBooking?.name || "Unknown Client",
      booking_type: selectedBooking?.booking_type || selectedBooking?.type || "Session",
    };

    if (editingId) {
      setPaymentsList(prev => prev.map(p => p.id === editingId ? paymentEntry : p));
      toast.success("Payment record updated");
    } else {
      setPaymentsList([paymentEntry, ...paymentsList]);
      toast.success("Payment record created");
    }
    setOpen(false);
    resetForm();
  };

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setFormData({
      booking_id: p.booking_id,
      amount: p.amount,
      payment_status: p.payment_status,
      payment_date: p.payment_date,
      payment_method: p.payment_method,
      notes: p.notes || "", // Ensure notes are loaded into edit
    });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this payment record?")) {
      setPaymentsList(paymentsList.filter((p) => p.id !== id));
      toast.error("Record deleted");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return "bg-emerald-500 text-white";
      case "pending": return "bg-amber-500 text-white";
      case "overdue": return "bg-rose-500 text-white";
      default: return "bg-slate-500 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8 text-black">
      <div className="max-w-full mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Payments</h1>
            <p className="text-slate-500">View and manage your revenue data</p>
          </div>

          <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="h-12 rounded-xl px-6 bg-[#4A85F6] hover:bg-[#3B71E3] shadow-md">
                <Plus className="mr-2 h-5 w-5" /> New Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white rounded-[32px] p-8 shadow-2xl border-none">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {editingId ? "Edit Payment" : "New Payment Record"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Select Booking</Label>
                  <Select value={formData.booking_id} onValueChange={(v) => setFormData({...formData, booking_id: v})}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white">
                      <SelectValue placeholder="Which booking is this for?" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {availableBookings.length > 0 ? (
                        availableBookings.map((b) => (
                          <SelectItem key={b.id} value={b.id}>
                            <span className="font-bold">{b.guestName || b.name}</span> — {b.booking_type || b.type}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-4 text-center text-slate-400">No bookings found</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Amount (RWF)</Label>
                    <StyledInput type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Status</Label>
                    <Select value={formData.payment_status} onValueChange={(v) => setFormData({...formData, payment_status: v})}>
                      <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Date</Label>
                    <StyledInput type="date" value={formData.payment_date} onChange={(e) => setFormData({...formData, payment_date: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Method</Label>
                    <StyledInput placeholder="MOMO, Cash, etc." value={formData.payment_method} onChange={(e) => setFormData({...formData, payment_method: e.target.value})} />
                  </div>
                </div>

                {/* NOTES INPUT (Restored) */}
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Notes / Reference</Label>
                  <textarea 
                    className="flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    placeholder="Transaction ID or extra details..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>

                <Button type="submit" className="w-full h-14 bg-[#4A85F6] text-white rounded-2xl text-lg font-bold shadow-lg">
                  {editingId ? "Update Record" : "Confirm Payment"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <StyledInput className="pl-12" placeholder="Search records..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="bg-white border border-slate-100 rounded-[28px] overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="py-5 pl-8 text-slate-500 font-bold uppercase text-xs">Client & Type</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase text-xs">Amount</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase text-xs">Status</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase text-xs">Details</TableHead>
                <TableHead className="text-right pr-8 text-slate-500 font-bold uppercase text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((p) => (
                <TableRow key={p.id} className="hover:bg-slate-50/50 border-b border-slate-50">
                  <TableCell className="py-6 pl-8">
                    <div className="font-bold text-slate-900">{p.client_name}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-tight">{p.booking_type}</div>
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">
                    {Number(p.amount).toLocaleString()} RWF
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("rounded-full px-3 py-1 font-bold", getStatusColor(p.payment_status))}>
                      {p.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-slate-600 font-medium">{p.payment_method || "No Method"}</div>
                    <div className="text-[11px] text-slate-400 italic max-w-[150px] truncate">{p.notes || "No notes"}</div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(p)} className="p-2 bg-slate-50 rounded-lg text-slate-500 hover:text-blue-600"><Pencil className="h-5 w-5" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-red-500"><Trash2 className="h-5 w-5" /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPayments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 text-slate-400">No matching records found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}