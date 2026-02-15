"use client";

import { Bell, Search, User } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="w-full border-b bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-5 shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back to Creconnect Admin</p>
        </div>

        <div className="flex items-center gap-6">
          {/* Search Bar */}
          <div className="hidden lg:flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2 w-64">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-0 focus:outline-none w-full ml-2 text-sm"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              A
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
