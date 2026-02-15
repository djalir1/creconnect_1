'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import api from '@/lib/api'; 
import {
  LayoutDashboard,
  Calendar,
  Users,
  CreditCard,
  FileText,
  Menu,
  LogOut,
  Settings
} from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const navigation = [
  { name: "Dashboard", href: "/dashboard/studio-new", icon: LayoutDashboard },
  { name: "Calendar", href: "/dashboard/studio-new/calendar", icon: Calendar },
  { name: "Clients", href: "/dashboard/studio-new/clients", icon: Users },
  { name: "Bookings", href: "/dashboard/studio-new/bookings", icon: Calendar },
  { name: "Payments", href: "/dashboard/studio-new/payments", icon: CreditCard },
  { name: "Reports", href: "/dashboard/studio-new/reports", icon: FileText },
];

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [studioName, setStudioName] = useState("STUDIO NAME");
  const pathname = usePathname();

  // Fetch the Studio Name set up by the user
  useEffect(() => {
    const fetchStudioInfo = async () => {
      try {
        const res = await api.get('/studios/mine'); 
        if (res.data && res.data.name) {
          setStudioName(res.data.name);
        }
      } catch (error) {
        console.error("Could not fetch studio name", error);
        setStudioName("Creconnect"); 
      }
    };
    fetchStudioInfo();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#050505] flex font-sans text-zinc-900 dark:text-zinc-100">
      
      {/* Sidebar - Stays White/Dark */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 transform bg-white dark:bg-black border-r border-zinc-200 dark:border-white/10 transition-transform duration-300 lg:translate-x-0 lg:static",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo Section - Dynamic Studio Name */}
          <div className="p-8 flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
            <span className="text-sm font-black tracking-[0.3em] uppercase truncate">
              {studioName}
            </span>
          </div>

          {/* Navigation - Individual Blue Active State */}
          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-5 py-4 rounded-2xl text-[12px] transition-all duration-200",
                    // The "Black" color you wanted changed is now Blue (#4A85F6)
                    isActive 
                      ? "bg-[#4A85F6] text-white shadow-lg shadow-blue-500/30" 
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 stroke-[2.5px]", isActive ? "text-white" : "text-inherit")} />
                  <span className="font-bold uppercase tracking-wider">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer Section */}
          <div className="p-6 border-t border-zinc-100 dark:border-white/5 space-y-1">
            <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <Settings className="h-5 w-5" />
              <span className="text-[12px] font-bold uppercase tracking-wider">Settings</span>
            </button>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
              }}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-[12px] font-bold uppercase tracking-wider">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="h-20 flex items-center justify-between px-8 bg-white/50 dark:bg-black/50 backdrop-blur-md border-b border-zinc-100 dark:border-white/5">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-6 ml-auto text-right">
             <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Owner Dashboard</span>
              <span className="text-[10px] font-black uppercase text-emerald-500">{studioName}</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10" />
          </div>
        </header>

        <main className="p-6 lg:p-10">
          <div className="max-w-6xl mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutContent>{children}</LayoutContent>
    </QueryClientProvider>
  );
}