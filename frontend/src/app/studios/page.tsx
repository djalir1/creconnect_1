"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import SpaceCard from "@/components/SpaceCard";
import Footer from "@/components/Footer";
import api from "@/lib/api";
import { Search } from "lucide-react";

interface Studio {
  id: string;
  images: string[];
  name: string;
  location: string;
  description: string;
  features: string[];
  availability: "available" | "away" | "out";
  approvalStatus?: "PENDING" | "APPROVED" | "REJECTED";
  pricePerHour?: number;
}

function StudiosContent() {
  const searchParams = useSearchParams();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [locationFilter] = useState(searchParams.get("location") || "");

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        const response = await api.get("/studios");
        const studiosData: Studio[] = response.data || [];

        const publicStudios = studiosData.filter(
          (s) => s.approvalStatus === "APPROVED" || !s.approvalStatus
        );

        setStudios(publicStudios);
      } catch (error) {
        console.error("Error fetching studios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudios();
  }, []);

  const filteredStudios = studios.filter((studio) => {
    const term = searchQuery.toLowerCase();
    const loc = locationFilter.toLowerCase();

    const matchesKeyword =
      studio.name.toLowerCase().includes(term) ||
      studio.location.toLowerCase().includes(term) ||
      (studio.description &&
        studio.description.toLowerCase().includes(term));

    const matchesLocation =
      locationFilter === "" ||
      studio.location.toLowerCase() === loc;

    return matchesKeyword && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col antialiased text-white font-[var(--font-figtree)]">
      <Navbar />
      <PageHeader />

      <main className="flex-1 w-full px-5 sm:px-6 lg:px-[5%] py-10 md:py-12 lg:py-16">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white border-r-transparent"></div>
          </div>
        ) : (
          <>
            {/* SEARCH BAR */}
            <div className="mb-14 md:mb-20">
              <div className="max-w-2xl lg:max-w-3xl mx-auto">
                <div className="relative group flex items-center bg-white/[0.12] backdrop-blur-3xl border border-white/50 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 focus-within:bg-white/[0.18] focus-within:border-white/80">
                  <div className="flex items-center w-full h-14 md:h-16 px-6 md:px-8">
                    <input
                      type="text"
                      placeholder="Search activities ..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-full bg-transparent border-none outline-none pr-4 text-base md:text-lg font-semibold text-white placeholder:text-white/80"
                    />
                    <div className="pl-2">
                      <Search className="w-5 h-5 md:w-6 md:h-6 text-white opacity-70 group-focus-within:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TITLE & COUNT */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 pb-8 border-b border-white/20">
              <div className="space-y-2">
                <p className="text-xs md:text-sm font-semibold text-white/50 uppercase tracking-wider">
                  Directory
                </p>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">
                  {locationFilter
                    ? `${locationFilter} Studios`
                    : "Activities & Studios"}
                </h1>
              </div>

              <div className="mt-4 sm:mt-0 inline-flex items-center px-5 py-2 text-sm font-semibold bg-white/20 border border-white/40 rounded-full">
                {filteredStudios.length}{" "}
                {filteredStudios.length === 1
                  ? "Space"
                  : "Spaces"}{" "}
                Available
              </div>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
              {filteredStudios.map((studio) => (
                <SpaceCard
                  key={studio.id}
                  id={studio.id}
                  images={studio.images}
                  name={studio.name}
                  location={studio.location}
                  description={studio.description}
                  availability={studio.availability}
                  approvalStatus={studio.approvalStatus}
                />
              ))}
            </div>

            {/* EMPTY STATE */}
            {filteredStudios.length === 0 && (
              <div className="text-center py-24 rounded-3xl border border-white/20 bg-white/[0.05] backdrop-blur-xl">
                <Search className="w-12 h-12 text-white/40 mx-auto mb-6" />
                <p className="text-xl font-semibold text-white/80 mb-4">
                  No matching studios found
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-base font-semibold underline decoration-2 underline-offset-8 hover:text-white/80 transition-colors"
                >
                  Clear search
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function StudiosPage() {
  return (
    <Suspense fallback={null}>
      <StudiosContent />
    </Suspense>
  );
}
