"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Building2, Search, MapPin, CheckCircle2, Trash2, Ban, RefreshCw } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

interface Studio {
  id: string;
  images: string[];
  name: string;
  location: string;
  availability: "available" | "away" | "out";
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  pricePerHour: number;
}

function AdminStudiosContent() {
  const searchParams = useSearchParams();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const fetchStudios = async () => {
    setLoading(true);
    try {
      const response = await api.get("/studios");
      const allStudios: Studio[] = response.data || [];
      // We only show APPROVED studios in this specific view
      const approvedOnly = allStudios.filter(s => s.approvalStatus === "APPROVED");
      setStudios(approvedOnly);
    } catch (error) {
      console.error("Error fetching studios:", error);
      toast.error("Failed to sync studio directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudios();
  }, []);

  // --- ADMIN ACTIONS ---

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently DELETE "${name}"? This cannot be undone.`)) return;
    
    try {
      await api.delete(`/studios/${id}`);
      toast.success("Studio deleted permanently");
      setStudios(studios.filter(s => s.id !== id));
    } catch (error) {
      // If this toast appears, verify you are logged in as 'Wilson Shizirungu'
      toast.error("Delete failed. Check server logs.");
    }
  };

  const handleSuspend = async (id: string) => {
    if (!confirm("Suspend this studio? It will be moved back to the Approvals/Pending list.")) return;

    try {
      await api.put(`/studios/admin/${id}/reject`); 
      toast.warning("Studio suspended and removed from public view");
      setStudios(studios.filter(s => s.id !== id));
    } catch (error) {
      toast.error("Suspension failed");
    }
  };

  const filteredStudios = studios.filter(
    (studio) =>
      studio.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      studio.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Active Studios</h1>
          <p className="text-slate-500">Managing {studios.length} live listings on Creconnect.</p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={fetchStudios} 
            className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 text-slate-600 transition-all"
            title="Refresh list"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Filter by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl w-full md:w-[300px] outline-none focus:ring-4 ring-blue-50 transition-all"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600 mb-4"></div>
          <p className="font-medium">Syncing studio directory...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudios.map((studio) => (
            <div key={studio.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
              {/* Image Preview */}
              <div className="h-40 bg-slate-200 relative overflow-hidden">
                {studio.images?.[0] ? (
                  <img src={studio.images[0]} alt={studio.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400"><Building2 size={40} /></div>
                )}
                
                {/* Admin Quick Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button 
                        onClick={() => handleSuspend(studio.id)}
                        className="p-3 bg-white text-amber-600 rounded-full hover:bg-amber-600 hover:text-white transition-all shadow-lg"
                        title="Suspend Studio"
                    >
                        <Ban size={20} />
                    </button>
                    <button 
                        onClick={() => handleDelete(studio.id, studio.name)}
                        className="p-3 bg-white text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-lg"
                        title="Delete Studio"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-900 truncate">{studio.name}</h3>
                  <CheckCircle2 size={18} className="text-blue-500 shrink-0" />
                </div>
                
                <div className="flex items-center gap-1 text-slate-500 text-xs mb-4">
                  <MapPin size={12} />
                  <span>{studio.location}</span>
                </div>

                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <p className="font-bold text-slate-900 text-sm">
                    {studio.pricePerHour?.toLocaleString()} <span className="text-[10px] text-slate-400">RWF/hr</span>
                  </p>
                  <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-md uppercase">Active</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredStudios.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
           <Building2 className="mx-auto text-slate-300 mb-4" size={48} />
           <p className="text-slate-500">No active studios found.</p>
        </div>
      )}
    </div>
  );
}

export default function AdminStudiosPage() {
  return (
    <Suspense fallback={<div className="p-10 text-slate-400">Loading...</div>}>
      <AdminStudiosContent />
    </Suspense>
  );
}