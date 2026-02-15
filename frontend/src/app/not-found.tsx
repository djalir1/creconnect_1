"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 text-center">
      <div className="relative w-80 h-80 mb-8 animate-in fade-in zoom-in duration-500">
         {/* Placeholder for illustration - using text for now if no specific asset */}
         <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-full opacity-20">
             <span className="text-9xl font-bold text-gray-300">404</span>
         </div>
         <Image 
            src="/Crec0nnect_page-0001.jpg" // Using logo as placeholder if other assets not available/specified
            alt="Logo"
            width={320}
            height={320}
            className="object-contain opacity-50 drop-shadow-lg"
         />
      </div>
      
      <h1 className="text-6xl font-black text-gray-900 mb-4">404</h1>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Page Not Found</h2>
      
      <p className="max-w-md text-lg text-gray-600 mb-10 leading-relaxed">
        Oops! The page you are looking for seems to have wandered off. It might have been moved or doesn&apos;t exist.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <button
          onClick={() => router.back()}
          className="flex-1 px-8 py-4 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-gray-900 hover:bg-gray-50 transition-all duration-300"
        >
          Go Back
        </button>
        
        <Link 
          href="/"
          className="flex-1 px-8 py-4 rounded-xl bg-black text-white font-semibold hover:bg-zinc-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
