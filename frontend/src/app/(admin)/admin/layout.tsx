"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Intentionally render admin layout without requiring authentication
  // to allow direct access during development.
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-blue-50 to-gray-100">
      <AdminSidebar />
      <div className="flex flex-col flex-1 pl-[260px]">
        <AdminHeader />
        <main className="p-8 flex-1">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
