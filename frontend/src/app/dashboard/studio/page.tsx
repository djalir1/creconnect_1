"use client";

import { useState, useEffect } from "react";
import {
  FaCamera,
  FaCalendar,
  FaPlus,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { MdTrendingUp } from "react-icons/md";
import StatsCard from "@/components/dashboard/StatsCard";
import ChatInterface from "@/components/dashboard/ChatInterface";
import PortfolioGallery from "@/components/dashboard/PortfolioGallery";
import QuickActions from "@/components/dashboard/QuickActions";
import CalendarModal from "@/components/dashboard/CalendarModal";
import ClientsModal from "@/components/dashboard/ClientsModal";
import ManageSpaceModal from "@/components/dashboard/ManageSpaceModal";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface Studio {
    id: string;
    name: string;
    description: string;
    location: string;
    rating: number;
    images: string[];
    pricePerHour?: number;
}

interface Booking {
    id: string;
    status: string;
    guestName: string;
    startDate: string;
    endDate: string;
    message?: string;
    totalPrice: number;
}

interface Conversation {
    id: string;
    participantName: string;
    lastMessage: string;
    lastMessageAt: string;
}

export default function StudioDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isClientsOpen, setIsClientsOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const fetchData = async () => {
    try {
      const [studiosRes, bookingsRes, messagesRes] = await Promise.all([
        api.get<Studio[]>("/studios/user/me"),
        api.get<Booking[]>("/bookings/owner-bookings"),
        api.get<Conversation[]>("/messages/conversations")
      ]);

      setStudios(studiosRes.data);
      setBookings(bookingsRes.data);
      setConversations(messagesRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchTrigger]);

  const stats = [
    {
      label: "My Studios",
      value: studios.length.toString(),
      icon: <FaCamera />,
      iconColor: "bg-purple-100 text-purple-600",
    },
    {
      label: "Total Bookings",
      value: bookings.length.toString(),
      icon: <FaCalendar />,
      iconColor: "bg-blue-100 text-blue-600",
    },
    {
      label: "Active Bookings",
      value: bookings.filter(b => b.status === "PENDING" || b.status === "CONFIRMED").length.toString(),
      icon: <FaCalendar />,
      iconColor: "bg-green-100 text-green-600",
    },
    {
      label: "Total Revenue",
      value: `$${bookings.reduce((acc, b) => acc + b.totalPrice, 0)}`,
      icon: <MdTrendingUp />,
      iconColor: "bg-orange-100 text-orange-600",
    },
  ];

  const createInitials = (name: string) => {
    if (!name) return "";
    const words = name.split(" ");
    return words.map((word) => word[0].toUpperCase()).join("");
  };

  const formattedMessages = conversations.map(conv => ({
    id: conv.id,
    name: conv.participantName,
    initials: createInitials(conv.participantName),
    message: conv.lastMessage,
    timestamp: new Date(conv.lastMessageAt).toLocaleDateString(),
    avatarColor: "bg-indigo-600",
  }));

  const portfolioImages = studios.flatMap(studio => 
    (Array.isArray(studio.images) ? studio.images : []).map((url: string, index: number) => ({
      id: `${studio.id}-${index}`,
      url: url,
      alt: studio.name
    }))
  ).slice(0, 6);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900"><Link href="/">Creconnect</Link></h1>
            <p className="text-sm text-gray-500">Studio Dashboard - Welcome, {user?.name}</p>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline"
              className="font-semibold flex items-center gap-2 shadow-md border-indigo-600 text-indigo-600 hover:bg-indigo-50"
              onClick={() => router.push("/setup/studio")}
            >
              <FaPlus />
              Add New Space
            </Button>
            <Button 
              className="font-semibold flex items-center gap-2 shadow-md bg-indigo-600 hover:bg-indigo-700"
              onClick={() => setIsManageModalOpen(true)}
            >
              <FaPlus />
              Manage Space
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {studios.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You don&apos;t have any spaces yet</h2>
            <p className="text-gray-500 mb-6">Create your first studio to start receiving bookings!</p>
            <Button 
              onClick={() => router.push("/setup/studio")}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Create My First Space
            </Button>
          </div>
        )}
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              iconColor={stat.iconColor}
            />
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Chat */}
          <div className="lg:col-span-1">
            <ChatInterface messages={formattedMessages} />
          </div>

          {/* Right Column - Portfolio & Quick Actions */}
          <div className="lg:col-span-2 space-y-8">
            <PortfolioGallery images={portfolioImages} />
            <QuickActions 
                onCalendarClick={() => setIsCalendarOpen(true)} 
                onClientsClick={() => setIsClientsOpen(true)}
                onAnalyticsClick={() => router.push("/dashboard/analytics")}
            />
          </div>
        </div>
      </main>

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        bookings={bookings}
      />

      <ClientsModal 
        isOpen={isClientsOpen}
        onClose={() => setIsClientsOpen(false)}
        bookings={bookings}
      />

      <ManageSpaceModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        space={studios[0]} // Simplification: managing the first studio for now
        type="studio"
        onUpdate={() => setFetchTrigger(prev => prev + 1)}
      />
    </div>
  );
}
