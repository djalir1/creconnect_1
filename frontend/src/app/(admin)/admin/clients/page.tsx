"use client";

import { useEffect, useState } from "react";
import { Search, Filter, MoreHorizontal, Calendar } from "lucide-react";
import api from "@/lib/api";

interface Client {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  _count: {
    bookings: number;
  };
}

export default function AdminClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get("/admin/users?role=CLIENT");
        setClients(response.data);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const filteredClients = clients.filter(client => 
    client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading platform clients...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Client Management</h1>
        <p className="text-muted-foreground mt-1">Oversee platform users and their booking relationship</p>
      </div>

      <div className="bg-card p-6 rounded-xl border border-border">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search clients by name or email..."
              className="w-full bg-muted/50 border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
           <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border overflow-hidden bg-background/50">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="p-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Client</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Status</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Bookings</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Joined</th>
                <th className="p-4 w-[50px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredClients.map((client, idx) => (
                <tr key={client.id} className="hover:bg-muted/30 transition-colors animate-slide-up" style={{ animationDelay: `${idx * 20}ms` }}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent-foreground font-bold">
                        {client.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{client.name}</p>
                        <p className="text-[10px] text-muted-foreground">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-semibold">
                    <span className="px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/20">Active</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      {client._count?.bookings || 0}
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{new Date(client.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <button className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredClients.length === 0 && (
             <div className="p-12 text-center text-muted-foreground italic">No clients found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
