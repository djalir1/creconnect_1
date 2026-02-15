'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaHome, FaMapMarkerAlt, FaCloudUploadAlt } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function StudioSetup() {
  const router = useRouter();
  const { user } = useAuth(); 
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studioName: '',
    location: '',
    about: '',
    features: ''
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const MAX_TOTAL_SIZE_MB = 10;
  const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;

  const checkTotalSize = (newFiles: File[], currentFiles: File[]) => {
    const totalSize = [...currentFiles, ...newFiles].reduce((acc, file) => acc + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE_BYTES) {
        toast.error(`Total file size exceeds ${MAX_TOTAL_SIZE_MB}MB. Selection reset.`);
        setFiles([]);
        return false;
    }
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (checkTotalSize(droppedFiles, files)) {
        setFiles(prev => [...prev, ...droppedFiles]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (checkTotalSize(selectedFiles, files)) {
          setFiles(prev => [...prev, ...selectedFiles]);
      }
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let imageUrls: string[] = [];
      
      // 1. Upload images to Backend
      if (files.length > 0) {
        const formDataUpload = new FormData();
        files.forEach(file => formDataUpload.append('images', file));
        
        const uploadRes = await api.post('/upload/multiple', formDataUpload, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrls = uploadRes.data.urls;
      }

      // 2. Prepare Features as a real Array
      const featuresArray = formData.features
        .split(',')
        .map(f => f.trim())
        .filter(f => f !== "");

      // 3. Submit to /studios
      await api.post('/studios', {
        name: formData.studioName,
        location: formData.location,
        description: formData.about,
        pricePerHour: 10, // Must be a number to pass backend Zod validation
        images: imageUrls,
        features: featuresArray,
        availability: "available"
      });

      setShowSuccessModal(true);
    } catch (error: any) {
      console.error('Failed to create studio:', error);
      const message = error.response?.data?.message || 'Failed to create studio. Check if you are logged in.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard/studio-new');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-none shadow-[0_20px_60px_rgba(0,0,0,0.1)] max-w-2xl w-full p-10 border border-zinc-100">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-black mb-3 uppercase tracking-tighter">Setup Your Space</h1>
          <p className="text-zinc-400 italic text-sm tracking-wide">Enter your studio details to get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Studio Name</label>
              <div className="relative">
                <FaHome className="absolute left-0 top-1/2 -translate-y-1/2 text-black" />
                <input
                  type="text"
                  name="studioName"
                  placeholder="The Sound Loft"
                  value={formData.studioName}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-zinc-200 focus:outline-none focus:border-black transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Location</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-0 top-1/2 -translate-y-1/2 text-black z-10" />
                <select
                  name="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-zinc-200 focus:outline-none focus:border-black transition-all text-sm appearance-none font-medium cursor-pointer"
                  required
                >
                  <option value="">Select a District</option>
                  <option value="Gasabo">Gasabo</option>
                  <option value="Kicukiro">Kicukiro</option>
                  <option value="Nyarugenge">Nyarugenge</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Features (Comma Separated)</label>
              <input
                type="text"
                name="features"
                placeholder="High-speed WiFi, Audio Interface, Vocal Booth"
                value={formData.features}
                onChange={handleChange}
                className="w-full px-0 py-3 bg-transparent border-b border-zinc-200 focus:outline-none focus:border-black transition-all text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">About the Studio</label>
              <textarea
                name="about"
                placeholder="Briefly describe your space and available gear..."
                value={formData.about}
                onChange={handleChange}
                rows={3}
                className="w-full px-0 py-3 bg-transparent border-b border-zinc-200 focus:outline-none focus:border-black transition-all resize-none text-sm font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Studio Gallery</label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-none p-10 text-center transition-all cursor-pointer ${
                  isDragging ? 'border-black bg-zinc-50' : 'border-zinc-200 hover:border-black'
                }`}
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <FaCloudUploadAlt className="text-4xl text-black mx-auto mb-3" />
                <p className="text-black font-black text-[10px] uppercase tracking-widest">Upload Images</p>
                <input
                  type="file"
                  id="fileInput"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {files.length > 0 && (
                  <div className="mt-4 text-[10px] font-bold text-orange-600 uppercase tracking-tighter">
                    {files.length} items ready to upload
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-6 rounded-none font-black text-xs uppercase tracking-[0.4em] hover:bg-zinc-800 transition-all shadow-xl disabled:opacity-50"
          >
            {isSubmitting ? 'Finalizing...' : 'Create Studio'}
          </button>
        </form>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-none p-16 max-w-md w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-4xl font-black text-black mb-4 uppercase tracking-tighter">Verified</h2>
            <p className="text-zinc-500 mb-10 text-sm italic tracking-tight">
              Your studio listing is being processed. It will be live shortly.
            </p>
            <button
              onClick={handleGoToDashboard}
              className="w-full bg-black text-white px-10 py-5 rounded-none font-black hover:bg-zinc-800 transition-all uppercase tracking-[0.3em] text-[10px]"
            >
              Enter Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}