"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";


export default function PageHeader() {
  const { user, logout } = useAuth();

  return (
    <>
      <header className="bg-black border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-3xl font-extrabold text-white tracking-tight">
              Creconnect.
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-lg font-medium text-white hover:text-zinc-200 transition-colors"
              >
                Explore
              </Link>

              {/* Dashboard / Admin link based on role */}
              {user && user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="text-lg font-medium text-white hover:text-zinc-200 transition-colors"
                >
                  Admin
                </Link>
              )}

              {user && user.role !== 'ADMIN' && (
                <Link
                  href={user.role === 'STUDIO_OWNER' ? '/dashboard/studio-new' : '/'}
                  className="text-lg font-medium text-white hover:text-zinc-200 transition-colors"
                >
                  Dashboard
                </Link>
              )}

              {/* Only show create space for studio owners */}
              {user && user.role === 'STUDIO_OWNER' && (
                <Link
                  href="/setup/studio"
                  className="bg-white hover:bg-zinc-700 text-black font-medium px-6 py-2 rounded-lg transition-colors"
                >
                  Create your space
                </Link>
              )}

              {/* Logout for any logged-in user */}
              {user && (
                <button
                  onClick={logout}
                  className="text-lg font-medium text-white hover:text-zinc-200 transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
