"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ImageSliderModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
}

export default function ImageSliderModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
}: ImageSliderModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
        document.body.style.overflow = "unset";
    };
  }, [isOpen, initialIndex]);

  if (!isOpen) return null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation - Left */}
      <button
        onClick={handlePrev}
        className="absolute left-4 md:left-8 text-white/50 hover:text-white transition-colors p-2 z-50 hover:bg-white/10 rounded-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 md:w-16 md:h-16">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Main Image */}
      <div className="relative w-full h-full max-w-7xl max-h-[85vh] mx-4 flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <div className="relative w-full h-full">
            <Image
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            fill
            className="object-contain"
            priority
            />
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm">
            {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Navigation - Right */}
      <button
        onClick={handleNext}
        className="absolute right-4 md:right-8 text-white/50 hover:text-white transition-colors p-2 z-50 hover:bg-white/10 rounded-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 md:w-16 md:h-16">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}
