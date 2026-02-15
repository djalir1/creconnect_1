"use client";

import { useState, useEffect } from "react";
import { Building2, Clock, CheckCircle, XCircle } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

interface Studio {
  id: string;
  name: string;
  location: string;
  pricePerHour: number;
  owner?: { name: string; email: string };
}

export default function ApprovalsPage() {
  const [pendingStudios, setPendingStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingStudios();
  }, []);

  const fetchPendingStudios = async () => {
    setLoading(true);
    try {
      const response = await api.get("/studios/admin/pending");
      setPendingStudios(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Could not load pending studios");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      await api.put(`/studios/admin/${id}/${action}`);
      toast.success(`Studio ${action}ed successfully`);
      fetchPendingStudios();
    } catch (error) {
      toast.error(`Failed to ${action} studio`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pending Approvals</h1>
        <p className="text-slate-500 text-sm">Verify new studio listings before they go live.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 italic">Loading requests...</div>
        ) : pendingStudios.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <CheckCircle className="text-green-500 mb-3" size={40} />
            <p className="text-slate-500 font-medium">All caught up! No pending studios.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingStudios.map((studio) => (
              <div key={studio.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex gap-4">
                  <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{studio.name}</h3>
                    <p className="text-sm text-slate-500">{studio.location} • {studio.pricePerHour.toLocaleString()} RWF/hr</p>
                    <p className="text-[10px] font-bold text-blue-600 mt-1 uppercase tracking-wider">Owner: {studio.owner?.name}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAction(studio.id, 'approve')} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition-transform active:scale-95">Approve</button>
                  <button onClick={() => handleAction(studio.id, 'reject')} className="border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-50 hover:text-red-600 transition-all">Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}