'use client';

import { useState, useMemo, useEffect } from "react";
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
import { Plus, Pencil, Trash2, Search, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Re-using the "Big & Good" styled input for consistency
const StyledInput = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="relative w-full">
    <input
      {...props}
      className={cn(
        "flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-base shadow-sm transition-all duration-200",
        "placeholder:text-slate-400 text-slate-700",
        "focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    />
  </div>
);

export default function Bookings() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // 1. SYNC WITH CLIENTS MENU: Pulling real clients from localStorage
  const [availableClients, setAvailableClients] = useState<any[]>([]);
  
  const [localBookings, setLocalBookings] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    client_id: "",
    booking_date: "",
    start_time: "",
    end_time: "",
    booking_type: "",
    status: "confirmed",
    notes: "",
  });

  // Load both Bookings and Real Clients on mount
  useEffect(() => {
    // Get Bookings
    const storedBookings = JSON.parse(localStorage.getItem("local_bookings") || "[]");
    setLocalBookings(storedBookings);

    // Get REAL Clients from the Clients Menu storage key
    const storedClients = JSON.parse(localStorage.getItem("app_clients_persistent") || "[]");
    setAvailableClients(storedClients);
  }, [open]); // Refresh client list whenever modal opens

  const filteredBookings = useMemo(() => {
    return localBookings.filter((b) => 
      b.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.booking_type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [localBookings, searchTerm]);

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed": return "bg-emerald-500 text-white";
      case "cancelled": return "bg-red-500 text-white";
      case "pending": return "bg-amber-500 text-white";
      default: return "bg-slate-500 text-white";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find the real client name based on selection
    const selectedClient = availableClients.find(c => c.id === formData.client_id);
    
    const bookingEntry = {
      ...formData,
      id: editingId || Math.random().toString(36).substr(2, 9),
      guestName: selectedClient ? selectedClient.name : "Unknown Client",
    };

    const updated = editingId 
      ? localBookings.map(b => b.id === editingId ? bookingEntry : b)
      : [bookingEntry, ...localBookings];

    setLocalBookings(updated);
    localStorage.setItem("local_bookings", JSON.stringify(updated));
    setOpen(false);
    setEditingId(null);
    toast.success(editingId ? "Booking updated" : "Booking created");
  };

  const handleEditClick = (booking: any) => {
    setEditingId(booking.id);
    setFormData({
      client_id: booking.client_id,
      booking_date: booking.booking_date,
      start_time: booking.start_time,
      end_time: booking.end_time,
      booking_type: booking.booking_type,
      status: booking.status,
      notes: booking.notes || "",
    });
    setOpen(true);
  };

  const deleteBooking = (id: string) => {
    if(confirm("Delete this booking?")) {
      const updated = localBookings.filter(b => b.id !== id);
      setLocalBookings(updated);
      localStorage.setItem("local_bookings", JSON.stringify(updated));
      toast.error("Booking removed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8 text-black">
      <div className="max-w-full mx-auto space-y-8">
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Bookings</h1>
            <p className="text-slate-500 mt-1">Manage studio bookings and schedules</p>
          </div>
          
          <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) setEditingId(null); }}>
            <DialogTrigger asChild>
              <Button className="bg-[#4A85F6] hover:bg-[#3B71E3] text-white rounded-xl px-6 h-12 shadow-sm">
                <Plus className="w-5 h-5 mr-2" />
                New Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white rounded-[32px] p-8 shadow-2xl border-none">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-slate-900">
                  {editingId ? "Edit Booking" : "Create Booking"}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-5 mt-6">
                {/* CLIENT SELECTION FROM REAL CLIENTS */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700 ml-1">Client</Label>
                  <Select value={formData.client_id} onValueChange={(v) => setFormData({...formData, client_id: v})}>
                    <SelectTrigger className="rounded-xl border-slate-200 h-12 bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {availableClients.length > 0 ? (
                        availableClients.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-slate-400 text-center">No clients found in menu</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700 ml-1">Booking Type</Label>
                  <StyledInput 
                    value={formData.booking_type} 
                    onChange={(e) => setFormData({...formData, booking_type: e.target.value})} 
                    placeholder="e.g., Studio Session" 
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 ml-1">Date</Label>
                    <div className="relative">
                      <StyledInput 
                        type="date" 
                        value={formData.booking_date} 
                        onChange={(e) => setFormData({...formData, booking_date: e.target.value})} 
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 ml-1">Status</Label>
                    <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                      <SelectTrigger className="rounded-xl border-slate-200 h-12 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 ml-1">Start Time</Label>
                    <StyledInput 
                      type="time" 
                      value={formData.start_time} 
                      onChange={(e) => setFormData({...formData, start_time: e.target.value})} 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 ml-1">End Time</Label>
                    <StyledInput 
                      type="time" 
                      value={formData.end_time} 
                      onChange={(e) => setFormData({...formData, end_time: e.target.value})} 
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700 ml-1">Notes</Label>
                  <StyledInput 
                    value={formData.notes} 
                    onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                    placeholder="Additional notes" 
                  />
                </div>

                <Button type="submit" className="w-full h-14 bg-[#4A85F6] text-white rounded-2xl text-lg font-bold mt-4 shadow-lg hover:bg-[#3B71E3] transition-all active:scale-[0.98]">
                  {editingId ? "Save Changes" : "Create Booking"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <StyledInput 
            placeholder="Search by client or type..." 
            className="pl-12" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        <div className="bg-white border border-slate-100 rounded-[28px] overflow-hidden shadow-sm w-full">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 bg-slate-50/30 hover:bg-slate-50/30">
                <TableHead className="py-5 pl-8 text-slate-500 font-bold uppercase text-xs tracking-wider">Client</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase text-xs tracking-wider">Type</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase text-xs tracking-wider">Date</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase text-xs tracking-wider">Time</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase text-xs tracking-wider">Status</TableHead>
                <TableHead className="text-right pr-8 text-slate-500 font-bold uppercase text-xs tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <TableRow key={b.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                    <TableCell className="py-6 pl-8 font-bold text-slate-900">{b.guestName}</TableCell>
                    <TableCell className="text-slate-600 font-medium">{b.booking_type}</TableCell>
                    <TableCell className="text-slate-600">{b.booking_date}</TableCell>
                    <TableCell className="text-slate-600 font-semibold">{b.start_time} - {b.end_time}</TableCell>
                    <TableCell>
                      <Badge className={cn("rounded-full px-4 py-1.5 font-bold border-0 shadow-sm", getStatusStyles(b.status))}>
                        {b.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => handleEditClick(b)} className="p-2 bg-slate-50 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all">
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button onClick={() => deleteBooking(b.id)} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16 text-slate-400 font-medium">No bookings found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}