'use client';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import StatCard from "../components/StatCard"; 
import { supabase } from "../integrations/supabase/client";
import api from "@/lib/api"; // fetch owner studios from backend
import { toast } from "sonner";
import { Calendar, Users, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [bookingsResult, clientsResult, paymentsResult] = await Promise.all([
        supabase.from("bookings").select("*", { count: "exact" }),
        supabase.from("clients").select("*", { count: "exact" }),
        supabase.from("payments").select("amount, payment_status"),
      ]);

      const totalRevenue = paymentsResult.data?.reduce(
        (sum, p) => sum + Number(p.amount),
        0
      ) || 0;

      const paidPayments = paymentsResult.data?.filter(
        (p) => p.payment_status === "paid"
      ).length || 0;

      return {
        totalBookings: bookingsResult.count || 0,
        totalClients: clientsResult.count || 0,
        totalRevenue: totalRevenue.toFixed(2),
        paidPayments,
      };
    },
  });

  const { data: recentBookings } = useQuery({
    queryKey: ["recent-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, clients(name)")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  // Fetch studios owned by the current user so the dashboard is connected to created spaces
  const queryClient = useQueryClient();

  const { data: myStudios } = useQuery({
    queryKey: ["my-studios"],
    queryFn: async () => {
      try {
        const res = await api.get('/studios/user/me');
        return res.data;
      } catch (error) {
        console.error('Failed to fetch my studios', error);
        return [];
      }
    },
  });

  const handleDeleteStudio = async (id: string) => {
    if (!confirm('Delete this studio? This action cannot be undone.')) return;
    try {
      await api.delete(`/studios/${id}`);
      toast.success('Studio deleted');
      queryClient.invalidateQueries(['my-studios']);
    } catch (error) {
      console.error('Failed to delete studio', error);
      toast.error('Failed to delete studio');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "cancelled":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your studio.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={stats?.totalBookings || 0}
          icon={Calendar}
          variant="default"
        />
        <StatCard
          title="Active Clients"
          value={stats?.totalClients || 0}
          icon={Users}
          variant="success"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue || 0}`}
          icon={DollarSign}
          variant="success"
        />
        <StatCard
          title="Paid Payments"
          value={stats?.paidPayments || 0}
          icon={TrendingUp}
          variant="default"
        />
      </div>

      {/* Your Studios */}
      {myStudios && myStudios.length > 0 ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Studios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myStudios.map((studio: any) => (
                <div key={studio.id} className="p-4 border rounded-lg flex items-center gap-4">
                  <div className="w-20 h-20 relative flex-shrink-0">
                    <img src={studio.images?.[0] || "/background.jpeg"} alt={studio.name} className="object-cover rounded-lg w-20 h-20" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{studio.name}</div>
                        <div className="text-sm text-muted-foreground">{studio.location}</div>
                      </div>
                      <div className="text-sm text-gray-600">{studio.approvalStatus || 'PENDING'}</div>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <a href={`/booking?id=${studio.id}`} className="text-sm text-indigo-600 hover:underline">View</a>
                      <button onClick={() => handleDeleteStudio(studio.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="mb-6 text-gray-500">You have no studios yet. Use the setup form to create your first studio.</div>
      )}

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBookings?.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    {booking.clients?.name}
                  </TableCell>
                  <TableCell>{booking.booking_type}</TableCell>
                  <TableCell>
                    {format(new Date(booking.booking_date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>{booking.start_time}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
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
