"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/admin/StatCard";
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Building2
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import api from "@/lib/api";

interface AnalyticsStats {
  bookings: {
    total: number;
  };
  revenue: number;
  studios: {
    approved: number;
  };
  users: {
    clients: number;
    studioOwners: number;
  };
}

export default function AdminAnalytics() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/stats");
        setStats(response.data.stats);
      } catch (error) {
        console.error("Failed to fetch analytics stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading analytics dashboard...</div>;

  // Mock data for charts since backend doesn't provide time-series yet
  const bookingTrends = [
    { month: "Jan", bookings: 45, revenue: 5400 },
    { month: "Feb", bookings: 52, revenue: 6240 },
    { month: "Mar", bookings: 48, revenue: 5760 },
    { month: "Apr", bookings: 61, revenue: 7320 },
    { month: "May", bookings: 55, revenue: 6600 },
    { month: "Jun", bookings: 67, revenue: 8040 },
  ];

  const locationData = [
    { name: "Downtown", value: 40, color: "#6366f1" },
    { name: "Westside", value: 30, color: "#a855f7" },
    { name: "East End", value: 20, color: "#ec4899" },
    { name: "Outskirts", value: 10, color: "#94a3b8" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>
        <p className="text-muted-foreground mt-1">Deep dive into performance metrics and growth trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Bookings"
          value={stats?.bookings?.total || 0}
          change={{ value: 12, label: "vs last month" }}
          icon={Calendar}
          variant="primary"
        />
        <StatCard
          title="Gross Revenue"
          value={`${(stats?.revenue || 0).toLocaleString()} RWF`}
          change={{ value: 18, label: "vs last month" }}
          icon={DollarSign}
          variant="success"
        />
        <StatCard
          title="Active Studios"
          value={stats?.studios?.approved || 0}
          change={{ value: 5, label: "new this week" }}
          icon={Building2}
          variant="accent"
        />
        <StatCard
          title="Total Users"
          value={(stats?.users?.clients || 0) + (stats?.users?.studioOwners || 0)}
          change={{ value: 8, label: "vs last month" }}
          icon={Users}
          variant="default"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Trends */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-bold mb-6">Revenue Growth (Last 6 Months)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bookingTrends}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#6366f1' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-bold mb-6">Booking Distribution by Area</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={locationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {locationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 ml-4">
              {locationData.map((loc) => (
                <div key={loc.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: loc.color }} />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{loc.name} ({loc.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
