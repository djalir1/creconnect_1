"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/admin/StatCard";
import { DollarSign, TrendingUp, CreditCard, RefreshCw, Download, ArrowDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface DashboardStats {
  studios: {
    total: number;
    pending: number;
    live: number;
  };
  bookings: {
    total: number;
  };
  revenue: number;
  users: {
    total: number;
    owners: number;
    clients: number;
  };
}

interface Booking {
  id: string;
  createdAt: string;
  studio?: {
    name: string;
  };
  user?: {
    name: string;
  };
  guestName?: string;
  totalPrice: number;
  status: string;
}

export default function AdminPayments() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/bookings")
        ]);
        
        setStats(statsRes.data.stats);
        setBookings(bookingsRes.data);
      } catch (error) {
        console.error("Failed to fetch payment data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading financial data...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments & Revenue</h1>
        <p className="text-muted-foreground mt-1">Track platform earnings, commissions, and payouts</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Gross Revenue"
          value={`${(stats?.revenue || 0).toLocaleString()} RWF`}
          icon={DollarSign}
          variant="primary"
        />
        <StatCard
          title="Commission (5%)"
          value={`${((stats?.revenue || 0) * 0.05).toLocaleString()} RWF`}
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="Net to Studios"
          value={`${((stats?.revenue || 0) * 0.95).toLocaleString()} RWF`}
          icon={CreditCard}
          variant="accent"
        />
        <StatCard
          title="Total Transactions"
          value={stats?.bookings?.total || 0}
          icon={RefreshCw}
          variant="default"
        />
      </div>

      <div className="bg-card p-6 rounded-xl border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recent Financial Activity</h2>
          <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>

        <div className="rounded-xl border border-border overflow-hidden bg-background/50">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="p-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Transaction</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Studio / Client</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Amount</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Fee</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Net Payout</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.slice(0, 10).map((booking, idx) => (
                <tr key={booking.id} className="hover:bg-muted/30 transition-colors animate-slide-up" style={{ animationDelay: `${idx * 20}ms` }}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-success/10 rounded-lg">
                        <ArrowDownLeft className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <p className="font-bold text-xs uppercase tracking-tighter">{booking.id.substring(0, 8)}</p>
                        <p className="text-[10px] text-muted-foreground">{new Date(booking.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-foreground">{booking.studio?.name}</p>
                    <p className="text-[10px] text-muted-foreground">{booking.user?.name || booking.guestName}</p>
                  </td>
                  <td className="p-4 font-bold text-foreground">{booking.totalPrice} RWF</td>
                  <td className="p-4 text-success font-semibold">{(booking.totalPrice * 0.05).toFixed(2)} RWF</td>
                  <td className="p-4 font-bold text-primary">{(booking.totalPrice * 0.95).toFixed(2)} RWF</td>
                  <td className="p-4">
                     <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        booking.status === "COMPLETED" ? "bg-success/20 text-success border-success/30" : 
                        "bg-warning/20 text-warning border-warning/30"
                      )}>
                        {booking.status}
                      </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && (
             <div className="p-12 text-center text-muted-foreground italic">No transaction records found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
