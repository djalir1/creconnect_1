"use client";

import { useEffect, useState } from "react";
import { Search, Download, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface Booking {
  id: string;
  user?: {
    name: string;
    email: string;
  };
  guestName?: string;
  studio?: {
    name: string;
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/admin/bookings");
        setBookings(response.data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.studio?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading bookings...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings Management</h1>
        <p className="text-muted-foreground mt-1">Track all reservations and guest transactions</p>
      </div>

      <div className="bg-card p-6 rounded-xl border border-border">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by client, studio, or ID..."
              className="w-full bg-muted/50 border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="bg-muted/50 border border-border rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border overflow-hidden bg-background/50 text-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="p-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Booking ID</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Client</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Studio</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Schedule</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Amount</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Status</th>
                <th className="p-4 w-[50px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBookings.map((booking, idx) => (
                <tr key={booking.id} className="hover:bg-muted/30 transition-colors animate-slide-up" style={{ animationDelay: `${idx * 20}ms` }}>
                  <td className="p-4 font-mono text-xs">{booking.id.substring(0, 8)}...</td>
                  <td className="p-4">
                    <div>
                      <p className="font-bold">{booking.user?.name || booking.guestName}</p>
                      <p className="text-[10px] text-muted-foreground">{booking.user?.email || "Guest"}</p>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-primary">{booking.studio?.name}</td>
                  <td className="p-4 text-xs font-medium">
                    {new Date(booking.startDate).toLocaleDateString()}
                    <br />
                    <span className="text-muted-foreground">
                      {new Date(booking.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-foreground">{booking.totalPrice} RWF</td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      booking.status === "COMPLETED" ? "bg-success/20 text-success border-success/30" : 
                      booking.status === "PENDING" ? "bg-warning/20 text-warning border-warning/30" : 
                      booking.status === "CONFIRMED" ? "bg-primary/20 text-primary border-primary/30" :
                      "bg-destructive/20 text-destructive border-destructive/30"
                    )}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredBookings.length === 0 && (
             <div className="p-12 text-center text-muted-foreground italic">No bookings found matching your search.</div>
          )}
        </div>
      </div>
    </div>
  );
}
