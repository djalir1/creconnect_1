"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface UserType {
  id: string;
  title: string;
  image: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const userTypes: UserType[] = [
  {
    id: "studio",
    title: "Studio Owner",
    image: "/background.jpeg",
  },
];

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleNext = () => {
    if (selectedType) {
      window.location.href = `/auth?mode=login`;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl flex flex-col shadow-2xl w-[95%] md:w-[80%] lg:w-[60%] mx-4 p-6 md:p-8 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>

        {/* Title */}
        <h2 className="text-3xl md:text-[2.5rem] uppercase font-extrabold text-center mb-8 text-gray-900 pt-4 md:pt-0">
          Login as Studio Owner
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {userTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`relative h-56 md:h-72 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${selectedType === type.id
                  ? "ring-4 ring-green-600 shadow-xl"
                  : "hover:scale-102 shadow-lg"
                }`}
            >
              <Image
                src={type.image}
                alt={type.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Selected Indicator */}
              {selectedType === type.id && (
                <div className="absolute top-3 right-3 bg-green-600 text-white rounded-full p-1">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              <div className=" w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <h3 className="text-3xl md:text-4xl uppercase font-extrabold text-white text-center">{type.title}</h3>
              </div>
            </button>
          ))}
        </div>

        {/* Next Button */}
        <Button
          onClick={handleNext}
          disabled={!selectedType}
          className={cn(
            "w-full md:w-fit py-4 md:py-5 px-6 md:px-40 self-center md:self-end rounded-lg font-semibold text-white transition-all duration-300",
            selectedType
              ? "bg-black hover:bg-zinc-700"
              : "bg-gray-300 cursor-not-allowed"
          )}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
