"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import api from "@/lib/api";
import { toast } from "sonner";

interface Studio {
  id: string;
  name: string;
  location: string;
  pricePerHour: number;
  owner?: { name: string; email: string };
  approvalStatus: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("pending"); // pending, users, studios
  const [pendingStudios, setPendingStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(false);

  // Manual Creation States
  const [clientData, setClientData] = useState({ name: "", email: "", password: "", role: "CLIENT" });
  const [studioData, setStudioData] = useState({ 
      name: "", description: "", location: "Kicukiro", pricePerHour: 0, 
      ownerId: "", approvalStatus: "APPROVED" 
  });

  useEffect(() => {
    if (activeTab === "pending") {
      fetchPendingStudios();
    }
  }, [activeTab]);

  const fetchPendingStudios = async () => {
    setLoading(true);
    try {
      const response = await api.get("/studios/admin/pending");
      setPendingStudios(response.data);
    } catch (error) {
      console.error("Error fetching pending studios:", error);
      // toast.error("Failed to load pending studios"); 
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.put(`/studios/admin/${id}/approve`);
      toast.success("Studio Approved successfully");
      fetchPendingStudios();
    } catch (error) {
      toast.error("Failed to approve studio");
      console.error("Error approving studio:", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.put(`/studios/admin/${id}/reject`);
      toast.success("Studio Rejected");
      fetchPendingStudios();
    } catch (error) {
      toast.error("Failed to reject studio");
      console.error("Error rejecting studio:", error);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/users/manual", clientData);
      toast.success("User created successfully");
      setClientData({ name: "", email: "", password: "", role: "CLIENT" });
    } catch (error) {
      toast.error("Failed to create user");
      console.error("Error creating user:", error);
    }
  };

  const handleCreateStudio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
          ...studioData,
          pricePerHour: Number(studioData.pricePerHour),
          ownerId: studioData.ownerId || undefined // Use current admin if empty or handle backend validation
      };
      await api.post("/studios/admin/manual", payload);
      toast.success("Studio created manually");
      setStudioData({ name: "", description: "", location: "Kicukiro", pricePerHour: 0, ownerId: "", approvalStatus: "APPROVED" });
    } catch (error) {
      console.error("Error creating studio:", error);
      toast.error("Failed to create studio. Check logs or ensure Owner ID is valid.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Admin Portal</h1>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("pending")}
            className={`pb-4 px-2 font-medium transition-colors relative ${
              activeTab === "pending" ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Pending Approvals
            {activeTab === "pending" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("manual_client")}
            className={`pb-4 px-2 font-medium transition-colors relative ${
              activeTab === "manual_client" ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Add Client
            {activeTab === "manual_client" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("manual_studio")}
            className={`pb-4 px-2 font-medium transition-colors relative ${
              activeTab === "manual_studio" ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Add Studio
            {activeTab === "manual_studio" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></div>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8 min-h-[400px]">
          {activeTab === "pending" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-4">Studios Awaiting Approval</h2>
              {loading ? (
                <p>Loading...</p>
              ) : pendingStudios.length === 0 ? (
                <p className="text-gray-500">No pending studios found.</p>
              ) : (
                <div className="grid gap-6">
                  {pendingStudios.map((studio) => (
                    <div key={studio.id} className="border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="font-bold text-lg">{studio.name}</h3>
                        <p className="text-gray-500 text-sm">{studio.location}</p>
                        <p className="text-gray-500 text-sm">Price: {studio.pricePerHour} RWF/hr</p>
                        <p className="text-indigo-600 text-sm mt-1">Owner: {studio.owner?.name} ({studio.owner?.email})</p>
                      </div>
                      <div className="flex gap-3">
                        <button 
                            onClick={() => handleApprove(studio.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            Approve
                        </button>
                        <button 
                            onClick={() => handleReject(studio.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "manual_client" && (
            <div className="max-w-md">
              <h2 className="text-xl font-bold mb-6">Manually Add Client</h2>
              <form onSubmit={handleCreateClient} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input 
                        type="text" 
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                        value={clientData.name}
                        onChange={(e) => setClientData({...clientData, name: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                        type="email" 
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                        value={clientData.email}
                        onChange={(e) => setClientData({...clientData, email: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input 
                        type="password" 
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                        value={clientData.password}
                        onChange={(e) => setClientData({...clientData, password: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select 
                        className="w-full px-4 py-2 border rounded-lg"
                        value={clientData.role}
                        onChange={(e) => setClientData({...clientData, role: e.target.value})}
                    >
                        <option value="CLIENT">Client</option>
                        <option value="STUDIO_OWNER">Studio Owner</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>
                <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-zinc-800">
                    Create User
                </button>
              </form>
            </div>
          )}

          {activeTab === "manual_studio" && (
            <div className="max-w-md">
              <h2 className="text-xl font-bold mb-6">Manually Add Studio</h2>
              <form onSubmit={handleCreateStudio} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input 
                        type="text" 
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                        value={studioData.name}
                        onChange={(e) => setStudioData({...studioData, name: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                        value={studioData.description}
                        onChange={(e) => setStudioData({...studioData, description: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <select 
                        className="w-full px-4 py-2 border rounded-lg"
                        value={studioData.location}
                        onChange={(e) => setStudioData({...studioData, location: e.target.value})}
                    >
                        <option value="Kicukiro">Kicukiro</option>
                        <option value="Gasabo">Gasabo</option>
                        <option value="Nyarugenge">Nyarugenge</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Hour (RWF)</label>
                    <input 
                        type="number" 
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                        value={studioData.pricePerHour}
                        onChange={(e) => setStudioData({...studioData, pricePerHour: Number(e.target.value)})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Owner ID (UUID)</label>
                    <input 
                        type="text" 
                        placeholder="Leave empty to assign to yourself"
                        className="w-full px-4 py-2 border rounded-lg"
                        value={studioData.ownerId}
                        onChange={(e) => setStudioData({...studioData, ownerId: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                        className="w-full px-4 py-2 border rounded-lg"
                        value={studioData.approvalStatus}
                        onChange={(e) => setStudioData({...studioData, approvalStatus: e.target.value})}
                    >
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                    </select>
                </div>
                <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-zinc-800">
                    Create Studio
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
