"use client";

import { useState, useEffect } from "react";
import { FaTimes, FaCamera, FaMapMarkerAlt, FaDollarSign } from "react-icons/fa";
import api from "@/lib/api";
import { toast } from "sonner";

import Image from "next/image";

interface Space {
  id: string;
  name: string;
  description: string;
  location: string;
  images: string[];
  pricePerHour?: number;
  pricePerDay?: number;
}

interface ManageSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  space: Space | null;
  type: "studio" | "venue";
  onUpdate: () => void;
}

export default function ManageSpaceModal({ isOpen, onClose, space, type, onUpdate }: ManageSpaceModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    price: "",
    images: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (space) {
      setFormData({
        name: space.name || "",
        description: space.description || "",
        location: space.location || "",
        price: (type === "studio" ? space.pricePerHour : space.pricePerDay)?.toString() || "",
        images: Array.isArray(space.images) ? space.images : []
      });
    }
  }, [space, type]);

  if (!isOpen || !space) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const endpoint = type === "studio" ? `/studios/${space.id}` : `/venues/${space.id}`;
      const payload: Partial<Space> & { pricePerHour?: number; pricePerDay?: number } = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
      };

      if (type === "studio") payload.pricePerHour = parseFloat(formData.price);
      else payload.pricePerDay = parseFloat(formData.price);

      await api.patch(endpoint, payload);
      toast.success("Space updated successfully!");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Failed to update space:", error);
      toast.error("Failed to update space.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Manage Space</h2>
            <p className="text-gray-500 mt-1">Update your {type} details and preferences</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Basic Info */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Space Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl focus:border-indigo-600 outline-none transition-all font-medium"
                placeholder="e.g. Skyline Creative Studio"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl focus:border-indigo-600 outline-none transition-all font-medium min-h-[120px] resize-none"
                placeholder="Tell users about your space..."
                required
              />
            </div>
          </div>

          {/* Location & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-indigo-600" /> Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl focus:border-indigo-600 outline-none transition-all font-medium"
                placeholder="City, Area"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FaDollarSign className="text-indigo-600" /> Price per {type === "studio" ? "Hour" : "Day"}
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl focus:border-indigo-600 outline-none transition-all font-medium"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Current Images */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <FaCamera className="text-indigo-600" /> Current Photos
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 group">
                  <Image 
                    src={img} 
                    alt={`Space ${idx}`} 
                    fill 
                    className="object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" className="text-white text-xs font-bold uppercase tracking-wider relative z-10">Preview</button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-indigo-600 hover:text-indigo-600 transition-all bg-gray-50"
              >
                <FaPlus size={20} />
                <span className="text-xs font-bold">Add New</span>
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-8 py-4 rounded-2xl font-bold text-gray-600 hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-[2] bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FaPlus({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    )
}
