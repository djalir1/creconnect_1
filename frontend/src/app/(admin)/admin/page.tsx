"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/admin/StatCard";
import { 
  Users, 
  Building2, 
  Clock, 
  CheckCircle,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    active: 0,
    users: 0
  });
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchEverything = async () => {
      setLoading(true);
      setError(false);
      try {
        // We fetch from multiple sources to ensure counts are accurate
        const [allRes, pendingRes, userRes] = await Promise.allSettled([
          api.get("/studios"),
          api.get("/studios/pending"), // Matching your Approval Menu endpoint
          api.get("/users")
        ]);

        const allStudios = allRes.status === 'fulfilled' ? (allRes.value.data || []) : [];
        const pendingStudios = pendingRes.status === 'fulfilled' ? (pendingRes.value.data || []) : [];
        const users = userRes.status === 'fulfilled' ? (userRes.value.data || []) : [];

        // Calculate counts based on the actual lists returned
        setCounts({
          total: allStudios.length,
          pending: pendingStudios.length,
          // Active = Total minus Pending (or filter for APPROVED)
          active: allStudios.filter((s: any) => 
            (s.approvalStatus || s.status) === "APPROVED"
          ).length,
          users: users.length
        });

      } catch (err) {
        console.error("Dashboard sync error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEverything();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        <p className="text-slate-400 text-sm font-medium">Syncing with database...</p>
      </div>
    );
  }

  const statItems = [
    {
      title: "Total Studios",
      value: counts.total,
      icon: Building2,
      variant: "primary" as const,
    },
    {
      title: "Pending Approval",
      value: counts.pending,
      icon: Clock,
      variant: "warning" as const,
    },
    {
      title: "Active Studios",
      value: counts.active,
      icon: CheckCircle,
      variant: "success" as const,
    },
    {
      title: "Total Users",
      value: counts.users,
      icon: Users,
      variant: "default" as const,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 leading-tight">Dashboard Overview</h1>
        <p className="text-slate-500">Data matched from your management menus.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* PENDING BOX */}
        <Link href="/admin/approvals" className="group p-8 bg-white border border-slate-200 rounded-[2.5rem] hover:border-amber-400 transition-all shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${counts.pending > 0 ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'}`} />
                <p className="text-slate-900 font-bold text-xl">Approvals</p>
              </div>
              <p className="text-slate-500">
                {counts.pending === 0 
                  ? "All caught up! No pending requests." 
                  : `You have ${counts.pending} request${counts.pending > 1 ? 's' : ''} to review.`}
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl text-slate-400 group-hover:bg-amber-500 group-hover:text-white transition-all">
              <ArrowRight size={24} />
            </div>
          </div>
        </Link>

        {/* ACTIVE BOX */}
        <Link href="/admin/studios" className="group p-8 bg-white border border-slate-200 rounded-[2.5rem] hover:border-blue-500 transition-all shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-900 font-bold text-xl mb-2">Active Studios</p>
              <p className="text-slate-500">Currently managing {counts.active} live listings.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <ArrowRight size={24} />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}