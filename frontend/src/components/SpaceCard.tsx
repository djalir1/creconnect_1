"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface SpaceCardProps {
  id: string;
  images: string[];
  name: string;
  location: string;
  description?: string;
  availability?: "available" | "away" | "out";
  approvalStatus?: "PENDING" | "APPROVED" | "REJECTED";
}

const availabilityConfig = {
  available: { text: "AVAILABLE NOW", color: "bg-emerald-500" },
  away: { text: "LIMITED SPOTS", color: "bg-amber-500" },
  out: { text: "FULLY BOOKED", color: "bg-rose-600" },
};

export default function SpaceCard({
  id,
  images,
  name,
  location,
  description,
  availability = "available",
  approvalStatus,
}: SpaceCardProps) {
  return (
    <Link
      href={`/booking?id=${id}`}
      className="
        group relative block overflow-hidden
        rounded-3xl
border-4 border-white/55


        shadow-2xl
        transition-all duration-700
        hover:-translate-y-2
        hover:border-white
        hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]
        font-[var(--font-figtree)]
      "
    >
      <div className="relative h-[700px] md:h-[680px] w-full overflow-hidden bg-black">
        <Image
          src={images[0] || "/background.jpeg"}
          alt={name}
          fill
          priority
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/70" />

        {/* Glass Content Box */}
        <div
          className="
            absolute bottom-0 left-0 right-0
            bg-white/[0.03] backdrop-blur-md
            border-t border-white/20
            p-8 pt-10
            transition-all duration-500
            group-hover:bg-white/[0.08]
            group-hover:backdrop-blur-lg
          "
        >
          {/* Shine Line */}
          <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="flex flex-col gap-5">
            <div className="space-y-2">
              <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/60">
                {location}
              </p>

              <h4 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                {name}
              </h4>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${availabilityConfig[availability].color} ring-4 ring-white/5`}
                />
                <span className="text-[10px] font-medium uppercase tracking-widest text-white/60">
                  {availabilityConfig[availability].text}
                </span>
              </div>

              <div
                className="
                  px-6 py-3
                  bg-white text-black
                  rounded-xl
                  font-semibold uppercase tracking-widest text-[10px]
                  transition-all duration-300
                  group-hover:scale-105
                "
              >
                Book Now →
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
