'use client';

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Utilities
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, Printer, CheckCircle2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [realBookings, setRealBookings] = useState<any[]>([]);

  useEffect(() => {
    const loadData = () => {
      const stored = JSON.parse(localStorage.getItem("local_bookings") || "[]");
      // Only showing confirmed ones as per your requirement
      setRealBookings(stored.filter((b: any) => b.status === "confirmed"));
    };

    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getBookingsForDay = (day: Date) => {
    return realBookings.filter((booking) => {
      if (!booking.startDate) return false;
      return isSameDay(parseISO(booking.startDate), day);
    });
  };

  const exportDayBookingsPDF = () => {
    if (!selectedDate) return;
    const dayBookings = getBookingsForDay(selectedDate);
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text(`Studio Schedule: ${format(selectedDate, "PPPP")}`, 14, 20);
    
    autoTable(doc, {
      startY: 30,
      head: [["Client", "Service Type", "Time", "Method", "Total"]],
      body: dayBookings.map((b) => [
        b.guestName || "Guest",
        b.booking_type || "Session",
        `${format(parseISO(b.startDate), "HH:mm")} - ${format(parseISO(b.endDate), "HH:mm")}`,
        b.paymentMethod?.toUpperCase() || "CASH",
        `${(b.amount || 0).toLocaleString()} RWF`,
      ]),
      headStyles: { fillColor: [16, 185, 129] }, // Emerald Green Header in PDF
      styles: { fontSize: 10 },
    });
    
    doc.save(`Schedule-${format(selectedDate, "yyyy-MM-dd")}.pdf`);
  };

  return (
    <div className="space-y-6 p-6 bg-[#F9F9F9] min-h-screen text-black">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black tracking-tighter uppercase">Studio Calendar</h1>
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          </div>
          <p className="text-emerald-600/70 text-[10px] font-black uppercase tracking-[0.2em]">Confirmed Sessions Only</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-emerald-100 rounded-xl p-1 shadow-sm">
          <Button variant="ghost" size="icon" className="hover:bg-emerald-50 text-emerald-600" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs font-black uppercase tracking-widest min-w-[140px] text-center text-emerald-900">
            {format(currentDate, "MMMM yyyy")}
          </span>
          <Button variant="ghost" size="icon" className="hover:bg-emerald-50 text-emerald-600" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border border-emerald-100 rounded-[2rem] bg-white shadow-xl shadow-emerald-900/5 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-emerald-50 bg-emerald-50/30">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-4 text-center text-[10px] font-black uppercase text-emerald-800/40 tracking-widest">{day}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7">
          {Array.from({ length: monthStart.getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[120px] border-r border-b border-emerald-50/50 bg-zinc-50/20" />
          ))}

          {daysInMonth.map((day) => {
            const dayBookings = getBookingsForDay(day);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "min-h-[120px] border-r border-b border-emerald-50 p-2 cursor-pointer transition-all hover:bg-emerald-50/30 group",
                  !isSameMonth(day, currentDate) && "opacity-20"
                )}
              >
                <span className={cn(
                  "text-xs font-black ml-1 mt-1 inline-block w-6 h-6 text-center leading-6 rounded-full transition-colors",
                  isToday ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" : "text-emerald-900/30 group-hover:text-emerald-600"
                )}>
                  {format(day, "d")}
                </span>
                
                <div className="mt-2 space-y-1">
                  {dayBookings.slice(0, 2).map((booking) => (
                    <div key={booking.id} className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-100 truncate shadow-sm">
                      <p className="text-[9px] font-black text-emerald-900 uppercase tracking-tighter truncate">{booking.guestName}</p>
                      <p className="text-[8px] font-bold text-emerald-500 uppercase">{booking.booking_type}</p>
                    </div>
                  ))}
                  {dayBookings.length > 2 && (
                    <div className="text-[8px] font-black text-emerald-400 text-center uppercase tracking-widest pt-1">
                      + {dayBookings.length - 2} More
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <DialogContent className="max-w-md bg-white border-none rounded-[2rem] text-black shadow-2xl shadow-emerald-900/20">
          <DialogHeader className="flex flex-row items-center justify-between border-b border-emerald-50 pb-6">
            <div>
              <DialogTitle className="text-2xl font-black tracking-tighter uppercase text-emerald-950">Daily Schedule</DialogTitle>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                {selectedDate && format(selectedDate, "MMMM dd, yyyy")}
              </p>
            </div>
            {selectedDate && getBookingsForDay(selectedDate).length > 0 && (
              <Button onClick={exportDayBookingsPDF} size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl gap-2 font-bold uppercase text-[10px] shadow-lg shadow-emerald-200 border-none transition-all active:scale-95">
                <Printer className="h-3 w-3" /> Print
              </Button>
            )}
          </DialogHeader>
          
          <div className="space-y-4 mt-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {selectedDate && getBookingsForDay(selectedDate).length === 0 && (
              <div className="py-12 text-center space-y-2">
                <div className="bg-emerald-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                  <ChevronLeft className="h-6 w-6 text-emerald-200 rotate-45" />
                </div>
                <p className="text-xs font-bold text-emerald-800/30 uppercase tracking-widest">No confirmed sessions</p>
              </div>
            )}
            {selectedDate && getBookingsForDay(selectedDate).map((b) => (
              <div key={b.id} className="p-5 rounded-[1.5rem] border border-emerald-100 bg-emerald-50/30 space-y-3 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-lg leading-none text-emerald-950">{b.guestName}</h4>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">{b.booking_type}</p>
                  </div>
                  <Badge className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest border-none px-3">
                    {b.source || "CONFIRMED"}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-emerald-100">
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black text-emerald-800/40 uppercase tracking-widest">Time Slot</p>
                    <p className="text-xs font-bold text-emerald-900">{format(parseISO(b.startDate), "HH:mm")} - {format(parseISO(b.endDate), "HH:mm")}</p>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <p className="text-[9px] font-black text-emerald-800/40 uppercase tracking-widest">Method</p>
                    <p className="text-xs font-black uppercase text-emerald-600">{b.paymentMethod || "Momo"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}