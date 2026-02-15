"use client";

import { FaTimes } from "react-icons/fa";
import Calendar from "./Calendar";

interface Booking {
  id: string;
  guestName: string;
  startDate: string;
  endDate: string;
  message?: string;
  status: string;
}

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
}

export default function CalendarModal({ isOpen, onClose, bookings }: CalendarModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Schedule</h2>
            <p className="text-gray-500 text-sm">Manage your bookings and availability</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>
        
        <div className="flex-1 p-6 overflow-hidden bg-white">
          <Calendar bookings={bookings} />
        </div>
      </div>
    </div>
  );
}
