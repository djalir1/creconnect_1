"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  MessageSquare,
  DollarSign,
  Star,
  CheckCircle,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { label: "Studios", icon: Building2, href: "/admin/studios" },
     { label: "Approvals", icon: CheckCircle, href: "/admin/approvals" },
    { label: "Bookings", icon: Calendar, href: "/admin/bookings" },
   
     { label: "Payments", icon: DollarSign, href: "/admin/payments" },
   
    { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    // Add your logout logic here (e.g., clearing cookies/localStorage)
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 shadow-lg overflow-y-auto z-50">
      <div className="p-6 flex flex-col h-full">
        {/* Logo */}
        <div className="mb-10">
          <Link href="/admin" className="flex items-center gap-3 mb-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Creconnect</h1>
              <p className="text-xs text-slate-400 font-medium tracking-wide">ADMIN PORTAL</p>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const Icon = item.iconComponent || item.icon; // Handle both key names
            const active = isActive(item.href || (item as any).href);
            
            return (
              <Link
                key={item.label}
                href={item.href || "/admin"}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-700/50 pt-4 mt-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-400 w-full transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;