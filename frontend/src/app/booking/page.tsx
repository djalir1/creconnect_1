"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import api from "@/lib/api";
import { toast } from "sonner";
import LocationMap from "@/components/LocationMap";
import ImageSliderModal from "@/components/ImageSliderModal";
import { Figtree } from "next/font/google";

// Import the font and assign to a variable
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["300","400","500","600","700","800","900"]
});

interface Space {
  id: string;
  name: string;
  description: string;
  images: string[];
  location: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  availability?: "available" | "away" | "out";
  pricePerHour?: number;
  pricePerDay?: number;
  features?: string[];
  approvalStatus?: "PENDING" | "APPROVED" | "REJECTED";
}

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState<"pre-booking" | "details">("pre-booking");

  const [guestName, setGuestName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeFrom, setSelectedTimeFrom] = useState("");
  const [selectedTimeTo, setSelectedTimeTo] = useState("");
  const [amount, setAmount] = useState("");

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    const fetchDetails = async () => {
      try {
        let response;
        try {
          response = await api.get(`/studios/${id}`);
        } catch {
          response = await api.get(`/venues/${id}`);
        }
        setSpace(response.data);
        if (response.data?.pricePerHour) {
          setAmount(String(response.data.pricePerHour));
        }
      } catch (error) {
        toast.error("Failed to load details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleNextStep = () => {
    if (!guestName.trim() || !serviceType.trim()) {
      toast.error("Please enter your name and the service type");
      return;
    }
    setBookingStep("details");
  };

  const handleProceedToPayment = () => {
    if (!selectedDate || !selectedTimeFrom || !selectedTimeTo) {
      toast.error("Please fill in the date and time");
      return;
    }

    const params = new URLSearchParams({
      spaceId: id || "",
      type: space?.pricePerHour ? "studio" : "venue",
      guestName,
      serviceType,
      date: selectedDate,
      timeFrom: selectedTimeFrom,
      timeTo: selectedTimeTo,
      amount: amount,
    });

    router.push(`/booking/payment?${params.toString()}`);
  };

  const openGallery = (index: number) => {
    setGalleryStartIndex(index);
    setIsGalleryOpen(true);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#282828] flex items-center justify-center font-bold text-2xl text-white font-[var(--font-figtree)]">
        Loading...
      </div>
    );
  if (!space)
    return (
      <div className="min-h-screen bg-[#282828] flex items-center justify-center font-bold text-2xl text-white font-[var(--font-figtree)]">
        Space not found
      </div>
    );

  const images = space.images && space.images.length > 0 ? space.images : ["/background.jpeg"];

  return (
    <main className={`antialiased font-[var(--font-figtree)]`}>
      <ImageSliderModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={images}
        initialIndex={galleryStartIndex}
      />

      {/* Hero Gallery Section */}
      <section className="py-12">
        <div className="w-full px-[5%]">
          {space.approvalStatus === "PENDING" && (
            <div className="mb-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 p-4 text-yellow-500 text-center font-bold uppercase tracking-widest text-xs">
              This space is currently pending approval.
            </div>
          )}

          <div className="grid grid-cols-5 gap-4 mb-8 h-[30rem] lg:h-[40rem]">
            <div
              className="col-span-3 relative overflow-hidden rounded-[2.5rem] cursor-pointer border border-white/10"
              onClick={() => openGallery(0)}
            >
              <Image src={images[0]} alt={space.name} fill className="object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="col-span-2 grid grid-rows-2 gap-4">
              <div
                className="relative overflow-hidden rounded-[2rem] cursor-pointer border border-white/10"
                onClick={() => openGallery(1)}
              >
                <Image
                  src={images[1] || images[0]}
                  alt={space.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div
                className="relative overflow-hidden rounded-[2rem] cursor-pointer border border-white/10"
                onClick={() => openGallery(2)}
              >
                <Image
                  src={images[2] || images[0]}
                  alt={space.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/20 transition-colors">
                  <p className="text-white text-sm font-black uppercase tracking-[0.2em]">
                    +{images.length - 2} Photos
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h1 className="text-5xl font-black text-white mb-2 uppercase tracking-tighter">{space.name}</h1>
            <p className="text-sm font-regular text-white/40 uppercase tracking-[0.3em]">{space.location}</p>
          </div>
        </div>
      </section>

      {/* Details & Booking Grid */}
      <section className="pb-24">
        <div className="w-full px-[5%]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Info Card – white bg + glass effect */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white backdrop-blur-xl border border-gray-200/60 rounded-[2.5rem] p-8 md:p-10 lg:p-12 shadow-xl shadow-gray-300/30">
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 mb-6">About the Space</h2>
                <p className="text-lg md:text-xl text-gray-800 leading-relaxed mb-10 font-medium">{space.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
                  {space.features?.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-700 font-semibold text-sm">
                      <span className="text-emerald-600 text-lg">✓</span> {f}
                    </div>
                  ))}
                </div>
              </div>

              {space.latitude && space.longitude && (
                <div className="h-[400px] rounded-[2.5rem] overflow-hidden border border-gray-200/60 shadow-xl shadow-gray-300/20">
                  <LocationMap lat={space.latitude} lng={space.longitude} />
                </div>
              )}
            </div>

            {/* Right Column: Booking Form – white bg + glass effect */}
            <div className="lg:col-span-1">
              <div className="bg-white backdrop-blur-xl border border-gray-200/60 rounded-[2.5rem] p-8 md:p-10 sticky top-24 shadow-2xl shadow-gray-400/30">
                <h3 className="text-xs font-black mb-3 text-center uppercase tracking-[0.4em] text-gray-500">Secure Booking</h3>
                <p className="text-center text-gray-900 text-xl md:text-2xl font-extrabold uppercase tracking-tight mb-10">Reserve Spot</p>

                {bookingStep === "pre-booking" ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold mb-3 uppercase tracking-wider text-gray-600">Your Name</label>
                      <input
                        type="text"
                        placeholder="FULL NAME"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full px-6 py-4 bg-white/30 backdrop-blur-md border border-gray-300 rounded-2xl text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200/30 transition-all text-sm uppercase tracking-wide"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-3 uppercase tracking-wider text-gray-600">Service Type</label>
                      <input
                        type="text"
                        placeholder="E.G. MUSIC VIDEO"
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        className="w-full px-6 py-4 bg-white/30 backdrop-blur-md border border-gray-300 rounded-2xl text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200/30 transition-all text-sm uppercase tracking-wide"
                      />
                    </div>
                    <button
                      onClick={handleNextStep}
                      className="w-full bg-gray-900 text-white font-bold py-5 rounded-2xl transition-all hover:bg-gray-800 uppercase text-sm tracking-widest shadow-md"
                    >
                      BOOK NOW
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                    <div className="space-y-5">
                      <div>
                        <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-gray-600">DATE</label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full px-6 py-4 bg-white/30 backdrop-blur-md border border-gray-300 rounded-2xl text-gray-900 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200/30 transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-600">FROM</label>
                          <input
                            type="time"
                            value={selectedTimeFrom}
                            onChange={(e) => setSelectedTimeFrom(e.target.value)}
                            className="w-full px-6 py-4 bg-white/30 backdrop-blur-md border border-gray-300 rounded-2xl text-gray-900 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200/30 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-600">TO</label>
                          <input
                            type="time"
                            value={selectedTimeTo}
                            onChange={(e) => setSelectedTimeTo(e.target.value)}
                            className="w-full px-6 py-4 bg-white/30 backdrop-blur-md border border-gray-300 rounded-2xl text-gray-900 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200/30 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-gray-600">TOTAL AMOUNT (RWF)</label>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full px-6 py-4 bg-white/30 backdrop-blur-md border border-gray-300 rounded-2xl text-gray-900 text-sm font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200/30 transition-all"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleProceedToPayment}
                      className="w-full bg-gray-900 text-white font-bold py-5 rounded-2xl transition-all hover:bg-gray-800 uppercase text-sm tracking-widest shadow-md"
                    >
                      Proceed to Payment
                    </button>

                    <button
                      onClick={() => setBookingStep("pre-booking")}
                      className="w-full text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-gray-800 transition-colors"
                    >
                      ← Back
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-[#232323] font-[var(--font-figtree)]">
      <Navbar />
      <PageHeader />
      <Suspense fallback={<div className="min-h-screen bg-[#282828] flex items-center justify-center text-white font-[var(--font-figtree)]">Loading...</div>}>
        <BookingContent />
      </Suspense>
      <Footer />
    </div>
  );
}
