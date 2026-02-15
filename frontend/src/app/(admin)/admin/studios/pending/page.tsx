"use client";

import { useEffect, useState } from "react";
import { Search, Clock, MapPin, DollarSign, CheckCircle, XCircle, User } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import Image from "next/image";


interface PendingStudio {
  id: string;
  name: string;
  description: string;
  location: string;
  pricePerHour: number;
  images: string | string[];
  features: string | string[];
  createdAt: string;
  owner?: {
    name: string;
  };
}

export default function StudiosPending() {
  const [studios, setStudios] = useState<PendingStudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchPendingStudios = async () => {
    try {
      const response = await api.get("/admin/studios/pending");
      setStudios(response.data);
    } catch (error: any) {
      console.error("Failed to fetch pending studios:", error);
      // Provide helpful message for auth errors
      const status = error?.response?.status;
      if (status === 401) {
        toast.error("Unauthorized. Please sign in as an admin to view pending studios.");
      } else if (status === 403) {
        toast.error("Forbidden. Admin access required to view this page.");
      } else {
        toast.error("Failed to load pending studios");
      }
      setErrorMessage(error?.response?.data?.message || "Failed to load pending studios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingStudios();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await api.patch(`/admin/studios/${id}/approve`);
      toast.success("Studio approved successfully");
      fetchPendingStudios();
    } catch (error) {
      console.error("Error approving studio:", error);
      toast.error("Error approving studio");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.patch(`/admin/studios/${id}/reject`);
      toast.success("Studio rejected");
      fetchPendingStudios();
    } catch (error) {
      console.error("Error rejecting studio:", error);
      toast.error("Error rejecting studio");
    }
  };

  const filteredStudios = studios.filter((studio) =>
    studio.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    studio.owner?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading pending queue...</div>;

  if (errorMessage) return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold">Unable to load pending studios</h3>
        <p className="text-sm text-muted-foreground mt-2">{errorMessage}</p>
        <div className="mt-4">
          <a href="/auth" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Sign in as admin</a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Approval Queue</h1>
        <p className="text-muted-foreground mt-1">Review and approve new studio submissions</p>
      </div>

      <div className="bg-card p-6 rounded-xl border border-border">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search pending studios..."
            className="w-full max-w-md bg-muted/50 border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Studios List */}
        <div className="space-y-6">
          {filteredStudios.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
              No pending studio submissions found.
            </div>
          ) : (
            filteredStudios.map((studio, idx) => {
              const images = typeof studio.images === 'string' && studio.images.startsWith('[') 
                ? JSON.parse(studio.images) 
                : studio.images;
              const imageUrl = Array.isArray(images) ? images[0] : images;

              const features = typeof studio.features === 'string' && studio.features.startsWith('[') 
                ? JSON.parse(studio.features) 
                : studio.features;

              return (
                <div
                  key={studio.id}
                  className="rounded-xl border border-border overflow-hidden animate-slide-up bg-background/50 hover:bg-background transition-colors"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 bg-muted/30 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="px-2 py-0.5 rounded-full bg-warning/15 text-warning text-xs font-semibold flex items-center gap-1 border border-warning/20">
                        <Clock className="h-3 w-3" />
                        Pending Review
                      </div>
                      <span className="text-xs text-muted-foreground">Submitted {new Date(studio.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex items-center gap-1.5"
                        onClick={() => handleReject(studio.id)}
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                      <button
                        className="px-3 py-1.5 text-xs font-medium bg-success text-white hover:bg-success/90 rounded-lg transition-colors flex items-center gap-1.5"
                        onClick={() => handleApprove(studio.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Images */}
                      <div className="lg:col-span-1">
                        {imageUrl ? (
                          <Image
                            width={500}
                            height={500}
                            src={imageUrl}
                            alt={studio.name}
                            className="w-full h-48 object-cover rounded-lg border border-border"
                          />
                        ) : (
                          <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm italic">
                            No images uploaded
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="lg:col-span-2 space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">{studio.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{studio.description}</p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Price/Hr</p>
                              <p className="text-sm font-semibold">{studio.pricePerHour} RWF</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Location</p>
                              <p className="text-sm font-semibold">{studio.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Owner</p>
                              <p className="text-sm font-semibold">{studio.owner?.name || "Unknown"}</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-muted/20 rounded-lg border border-border/50">
                          <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">Features</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {(Array.isArray(features)) && (features as string[]).map((feature: string) => (
                              <span key={feature} className="px-2 py-0.5 bg-background border border-border rounded-md text-[10px] font-medium">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
