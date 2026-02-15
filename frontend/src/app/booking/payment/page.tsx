"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import { toast } from "sonner";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentProvider, setPaymentProvider] = useState<"airtel" | "mtn">("mtn");
  const [payerPhone, setPayerPhone] = useState("");

  const amount = parseFloat(searchParams.get("amount") || "0");
  const serviceFee = 5000;
  const grandTotal = amount + serviceFee;

  const guestName = searchParams.get("guestName") || "Guest";
  const date = searchParams.get("date") || new Date().toLocaleDateString();
  const timeFrom = searchParams.get("timeFrom") || "00:00";
  const timeTo = searchParams.get("timeTo") || "00:00";
  const studioName = searchParams.get("spaceName") || "Creconnect Space";

  const handlePay = async () => {
    if (!payerPhone) {
      toast.error("Please enter your phone number");
      return;
    }
    setIsProcessing(true);

    const newBooking = {
      id: Math.random().toString(36).substr(2, 9),
      guestName: guestName,
      booking_type: "Online Booking",
      startDate: `${date} ${timeFrom}`,
      endDate: `${date} ${timeTo}`,
      status: "pending",
      amount: amount,
    };

    const existingBookings = JSON.parse(localStorage.getItem("local_bookings") || "[]");
    localStorage.setItem("local_bookings", JSON.stringify([newBooking, ...existingBookings]));

    setTimeout(() => {
      setShowReceipt(true);
      toast.success("Payment Successful!");
      setIsProcessing(false);
    }, 1500);
  };

  // Clean Light-Mode Input Style
  const inputClass = `
    w-full px-6 py-4 
    bg-gray-50
    border-2 border-gray-100 
    rounded-2xl text-black text-sm font-bold
    outline-none transition-all duration-300
    focus:border-black focus:bg-white
    placeholder:text-gray-400 uppercase tracking-wide
  `;

  if (showReceipt) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
        <div id="receipt-content" className="max-w-sm w-full bg-white border border-gray-100 p-8 rounded-[2.5rem] space-y-5 shadow-xl text-black">
          <div className="text-center border-b border-gray-100 pb-5">
            <h1 className="text-2xl font-black uppercase tracking-tighter">Creconnect</h1>
            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Official Receipt</p>
          </div>

          <div className="space-y-3 text-[13px]">
            <div className="flex justify-between"><span className="text-gray-400 italic">Studio</span><span className="font-bold">{studioName}</span></div>
            <div className="flex justify-between"><span className="text-gray-400 italic">Customer</span><span className="font-bold">{guestName}</span></div>
            <div className="flex justify-between"><span className="text-gray-400 italic">Date</span><span className="font-bold">{date}</span></div>
            <div className="pt-4 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-gray-500"><span>Booking</span><span>{amount.toLocaleString()} RWF</span></div>
                <div className="flex justify-between text-gray-500"><span>Service</span><span>{serviceFee.toLocaleString()} RWF</span></div>
                <div className="flex justify-between items-center pt-2 border-t border-black font-black text-lg">
                    <span>Total</span><span>{grandTotal.toLocaleString()} RWF</span>
                </div>
            </div>
          </div>

          <p className="text-center text-[10px] font-bold pt-4 border-t border-dashed border-gray-200 uppercase tracking-widest">Payment Confirmed</p>

          <div className="flex flex-col gap-2 print:hidden pt-4">
            <button onClick={() => window.print()} className="w-full bg-black text-white font-bold py-4 rounded-2xl text-xs uppercase tracking-widest hover:opacity-90 transition-all">
              Download PDF
            </button>
            <button onClick={() => router.push("/")} className="text-gray-400 font-bold py-2 text-[10px] uppercase tracking-widest hover:text-black transition-all">
              Close
            </button>
          </div>
        </div>
        <style jsx global>{`
          @media print {
            body * { visibility: hidden; }
            #receipt-content, #receipt-content * { visibility: visible; }
            #receipt-content { position: absolute; left: 0; top: 0; width: 100%; border: none; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <main className="max-w-lg mx-auto px-6 py-12">
      <div className="bg-white border border-gray-100 rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
        <div className="text-center mb-10">
          <h3 className="text-[10px] font-black mb-3 uppercase tracking-[0.5em] text-gray-400">Secure Checkout</h3>
          <h1 className="text-3xl font-black text-black tracking-tighter uppercase">Mobile Money</h1>
        </div>

        <div className="space-y-8">
          {/* Total Payable Display */}
          <div className="p-8 bg-black rounded-[2rem] relative overflow-hidden text-white shadow-lg">
            <div className="flex justify-between items-end relative z-10">
              <div>
                <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-1">Total Payable</p>
                <p className="text-3xl font-black text-white tracking-tighter">{grandTotal.toLocaleString()} <span className="text-xs text-white/50 font-normal uppercase">RWF</span></p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm uppercase tracking-tight">{studioName}</p>
                <p className="text-[10px] text-white/50 mt-1 uppercase font-black tracking-widest">{date}</p>
              </div>
            </div>
            {/* Subtle background element */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Select Provider</label>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setPaymentProvider("mtn")} className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 ${paymentProvider === "mtn" ? "border-yellow-400 bg-yellow-50" : "border-gray-100 bg-gray-50 grayscale opacity-60"}`}>
                <div className="relative w-8 h-8 flex-shrink-0"><Image src="/logo1.png" alt="MTN" fill className="object-contain" /></div>
                <span className="text-[11px] font-black text-black uppercase tracking-widest">MTN MOMO</span>
              </button>
              <button onClick={() => setPaymentProvider("airtel")} className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 ${paymentProvider === "airtel" ? "border-red-500 bg-red-50" : "border-gray-100 bg-gray-50 grayscale opacity-60"}`}>
                <div className="relative w-8 h-8 flex-shrink-0"><Image src="/logo2.png" alt="Airtel" fill className="object-contain" /></div>
                <span className="text-[11px] font-black text-black uppercase tracking-widest">AIRTEL</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Phone Number</label>
            <input 
              type="tel" 
              value={payerPhone} 
              onChange={(e) => setPayerPhone(e.target.value)} 
              placeholder="07XXXXXXXX" 
              className={inputClass} 
            />
          </div>

          <div className="pt-6 border-t border-gray-100 space-y-2">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-gray-400"><span>Space Subtotal</span><span>{amount.toLocaleString()} RWF</span></div>
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-gray-400"><span>Processing Fee</span><span>{serviceFee.toLocaleString()} RWF</span></div>
          </div>

          <button 
            onClick={handlePay} 
            disabled={isProcessing} 
            className="w-full bg-black text-white font-black py-5 rounded-[1.5rem] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 text-xs uppercase tracking-[0.3em] shadow-lg"
          >
            {isProcessing ? "Processing..." : `Confirm & Pay`}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar />
      <PageHeader />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-black font-bold tracking-[0.5em] uppercase text-xs">Loading...</div>}>
        <PaymentContent />
      </Suspense>
      <Footer />
    </div>
  );
}