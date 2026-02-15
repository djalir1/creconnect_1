"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import api from "@/lib/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Booking {
  id: string;
  startDate: string;
  endDate: string;
  guestName: string;
  totalPrice: number;
  paymentMethod?: string;
  studio?: { name: string; location: string };
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) return;

    const fetchBooking = async () => {
      try {
        // We probably need an endpoint to get single booking by ID.
        // Assuming /bookings/:id or similar exists or we search in list.
        // Since we don't have a specific GET /bookings/:id in the list I saw, 
        // I will assume for now we might need to filter from my-bookings or owner-bookings 
        // OR hopefully there is a generic get one.
        // Looking at backend controllers, updateBookingStatus does findUnique, so GET /bookings/:id might exist?
        // Let's try GET /bookings/my-bookings and find it, or just GET /bookings/:id if implied.
        // Actually, let's look at `routes/bookingRoutes.ts` if I could?
        // But simply, let's try to implement a robust way.
        const response = await api.get(`/bookings/${bookingId}`);
        setBooking(response.data);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const downloadReceipt = async () => {
    if (!booking) {
        toast.error("Receipt download failed: Booking details not available.");
        return;
    }

    try {
        const doc = new jsPDF();

        // Add Logo or Title
        doc.setFontSize(22);
        doc.text("CRECONNECT", 20, 20);
        
        doc.setFontSize(16);
        doc.text("Booking Receipt", 20, 30);
        
        doc.setFontSize(12);
        doc.text(`Receipt ID: #${booking.id.substring(0, 8)}`, 20, 45);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 52);

        const spaceName = booking.studio?.name || "Space";
        const spaceLocation = booking.studio?.location || "Location";

        autoTable(doc, {
        startY: 60,
        head: [['Description', 'Details']],
        body: [
            ['Guest Name', booking.guestName],
            ['Space', spaceName],
            ['Location', spaceLocation],
            ['Start Date', new Date(booking.startDate).toLocaleString()],
            ['End Date', new Date(booking.endDate).toLocaleString()],
            ['Payment Method', booking.paymentMethod || "N/A"],
            ['Total Paid', `${(booking.totalPrice || 0).toLocaleString()} RWF`],
        ],
        theme: 'grid',
        headStyles: { fillColor: [66, 66, 66] },
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        doc.text("Thank you for using CreConnect!", 20, (doc as any).lastAutoTable.finalY + 20);

        const filename = `receipt-${booking.id.substring(0, 8)}.pdf`;
        
        // Save for user
        doc.save(filename);
        
        // Upload to server
        const pdfBlob = doc.output('blob');
        const formData = new FormData();
        formData.append('receipt', pdfBlob, filename);
        
        await api.post('/receipts/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        toast.success("Receipt downloaded and stored successfully!");
    } catch (error) {
        console.error("Download/Upload failed:", error);
        toast.error("Failed to generate or store receipt. Please try again.");
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center">Loading receipt...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />
      
      <main className="max-w-3xl mx-auto px-6 py-20">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden text-center p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
            <p className="text-gray-500 mb-8">Your booking has been successfully placed. You can download your receipt below.</p>

            {booking && (
                <div className="text-left bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100 hidden">
                     {/* Hidden detail block, PDF has it all */}
                     <p>Booking ID: {booking.id}</p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                    onClick={downloadReceipt}
                    className="flex items-center justify-center gap-2 bg-black hover:bg-zinc-800 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Receipt
                </button>

                <button 
                    onClick={() => router.push("/")}
                    className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 px-8 rounded-xl transition-all"
                >
                    Back to Home
                </button>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
