"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full bg-[#1a1a1e]/80 backdrop-blur-xl border-b border-white/10 h-20">
      <div className="max-w-7xl mx-auto flex h-full items-center justify-between px-6 sm:px-10 lg:px-12">
        
        {/* Left Side: Logo */}
        <div className="flex items-center">
          <Link href="/" className="group flex items-center">
            <div className="relative w-24 h-16 flex items-center justify-center">
              <Image
                src="/Crec0nnect_page-0001.jpg"
                alt="Crec0nnect Logo"
                width={120}
                height={120}
                className="object-contain scale-110"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/studios" className="text-white/70 hover:text-white font-medium uppercase text-[11px] tracking-[0.2em] transition-colors">
            Explore Studios
          </Link>
          <Link href="/booking" className="text-white/70 hover:text-white font-medium uppercase text-[11px] tracking-[0.2em] transition-colors">
            How it Works
          </Link>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            href="/auth?mode=register&role=STUDIO_OWNER"
            className="px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest border border-white/20 text-white hover:bg-white/10 transition-all"
          >
            List your studio
          </Link>
          <Link
            href="/auth?mode=login"
            className="px-8 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest bg-white text-black hover:bg-zinc-200 transition-all shadow-lg"
          >
            Sign in
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 14h16M4 21h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#1a1a1e] border-b border-white/10 py-8 px-6 flex flex-col gap-6">
          <Link href="/studios" className="text-white text-lg font-semibold border-b border-white/5 pb-4" onClick={() => setIsMobileMenuOpen(false)}>
            Explore Studios
          </Link>
          <Link href="/auth?mode=register&role=STUDIO_OWNER" className="text-white text-lg font-semibold border-b border-white/5 pb-4" onClick={() => setIsMobileMenuOpen(false)}>
            List your studio
          </Link>
          <Link href="/auth?mode=login" className="w-full bg-white text-black text-center py-4 rounded-xl font-bold uppercase" onClick={() => setIsMobileMenuOpen(false)}>
            Sign in
          </Link>
        </div>
      )}
    </nav>
  );
}