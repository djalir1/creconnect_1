"use client";

import { useEffect, useState, useCallback } from "react";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { FaChartPie } from "react-icons/fa";

interface Booking {
    id: string;
    guestName: string;
    startDate: string;
    totalPrice: number;
    studio?: { name: string };
    venue?: { name: string };
}

export default function AnalyticsPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    const applyFilter = useCallback((data: Booking[]) => {
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        end.setHours(23, 59, 59, 999);

        const filtered = data.filter(booking => {
            const bDate = new Date(booking.startDate);
            return bDate >= start && bDate <= end;
        });

        setFilteredBookings(filtered);
    }, [dateRange]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setIsLoading(true);
                const response = await api.get<Booking[]>("/bookings/owner-bookings");
                setBookings(response.data);
                applyFilter(response.data);
            } catch (error) {
                console.error("Failed to fetch bookings:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchBookings();
        }
    }, [user, applyFilter]);

    const handleFilterChange = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilter(bookings);
    };

    const totalRevenue = filteredBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader />
            
            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">Analytics & Reports</h1>
                        <p className="text-gray-500 mt-2 text-lg">Track your space performance and revenue insights</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                        <div className="bg-indigo-600 text-white p-4 rounded-xl shadow-lg shadow-indigo-200">
                            <FaChartPie size={24} />
                        </div>
                        <div className="pr-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Reports Status</p>
                            <p className="text-lg font-bold text-gray-900">Live Coverage</p>
                        </div>
                    </div>
                </div>

                {/* Date Filter & Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                             Date Range Filter
                        </h2>
                        <form onSubmit={handleFilterChange} className="flex flex-col sm:flex-row items-end gap-6">
                            <div className="flex-1 w-full text-left">
                                <label className="block text-sm font-bold text-gray-400 uppercase mb-2 ml-1">Start Date</label>
                                <input 
                                    type="date" 
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-indigo-600 focus:bg-white outline-none transition-all font-semibold text-gray-700"
                                />
                            </div>
                            <div className="flex-1 w-full text-left">
                                <label className="block text-sm font-bold text-gray-400 uppercase mb-2 ml-1">End Date</label>
                                <input 
                                    type="date" 
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-indigo-600 focus:bg-white outline-none transition-all font-semibold text-gray-700"
                                />
                            </div>
                            <button 
                                type="submit"
                                className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-indigo-700 hover:scale-105 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                            >
                                Apply Filter
                            </button>
                        </form>
                    </div>

                    <div className="bg-indigo-900 p-8 rounded-3xl shadow-xl text-white flex flex-col justify-center relative overflow-hidden group">
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                        <p className="text-indigo-300 font-bold uppercase tracking-widest text-sm mb-2">Total Revenue (Range)</p>
                        <h3 className="text-5xl font-black mb-1">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                        <p className="text-indigo-200/80 font-medium">From {filteredBookings.length} bookings</p>
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Performance Report</h2>
                        <span className="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                            {filteredBookings.length} Results
                        </span>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-8 py-5 text-sm font-black text-gray-400 uppercase tracking-widest">Date</th>
                                    <th className="px-8 py-5 text-sm font-black text-gray-400 uppercase tracking-widest">Client Name</th>
                                    <th className="px-8 py-5 text-sm font-black text-gray-400 uppercase tracking-widest">Space</th>
                                    <th className="px-8 py-5 text-sm font-black text-gray-400 uppercase tracking-widest text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="p-20 text-center">
                                            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-indigo-600 mx-auto mb-6"></div>
                                            <p className="text-gray-500 font-bold text-xl">Aggregating Data...</p>
                                        </td>
                                    </tr>
                                ) : filteredBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-20 text-center">
                                            <p className="text-gray-400 font-bold text-xl italic">No data found for the selected range.</p>
                                        </td>
                                    </tr>
                                ) : filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50/80 transition-all group">
                                        <td className="px-8 py-6 font-bold text-gray-600">
                                            {new Date(booking.startDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black">
                                                    {(booking.guestName || "G")[0]}
                                                </div>
                                                <span className="font-bold text-gray-900">{booking.guestName || "Guest Client"}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-xl text-xs font-bold ring-1 ring-gray-200">
                                                {booking.studio?.name || booking.venue?.name || "Premium Space"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right font-black text-gray-900 text-lg">
                                            ${(booking.totalPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
