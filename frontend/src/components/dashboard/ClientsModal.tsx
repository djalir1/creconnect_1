"use client";

import { FaTimes, FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Booking {
  id: string;
  guestName: string;
  startDate: string;
  totalPrice?: number;
}

interface ClientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
}

export default function ClientsModal({ isOpen, onClose, bookings }: ClientsModalProps) {
  if (!isOpen) return null;

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text("Clients Booking Report", 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Table data
    const tableRows = bookings.map(booking => [
      new Date(booking.startDate).toLocaleDateString(),
      booking.guestName || "Guest",
      "Confirmed", // Status as per UI
      `$${booking.totalPrice?.toFixed(2) || "0.00"}`
    ]);

    autoTable(doc, {
      startY: 40,
      head: [["Date", "Client Name", "Status", "Amount"]],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [79, 70, 229] }, // Indigo-600
    });

    doc.save("clients-list.pdf");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Clients</h2>
            <p className="text-gray-500 text-sm">A list of all clients who have booked your space</p>
          </div>
          <div className="flex items-center gap-3">
            {bookings.length > 0 && (
              <button
                onClick={generatePDF}
                className="flex items-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-xl text-sm font-bold transition-all"
              >
                <FaDownload size={14} />
                Download PDF
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto">
          {bookings.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No bookings found yet.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50">
                  <div>
                    <h3 className="font-bold text-gray-900">{booking.guestName}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.startDate).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      Confirmed
                    </div>
                    <p className="text-sm font-bold text-gray-700">${booking.totalPrice?.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
