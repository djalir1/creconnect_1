"use client";

import Image from "next/image";
import Link from "next/link";

export default function Studios() {
  const districts = [
    {
      name: "Gasabo",
      image: "/imageOne.jpg",
      description: "Modern studios in the heart of Gasabo district.",
    },
    {
      name: "Kicukiro",
      image: "/imageTwo.jpg",
      description: "Creative spaces located in the vibrant Kicukiro area.",
    },
    {
      name: "Nyarugenge",
      image: "/imageThree.jpg",
      description: "Traditional and contemporary studios in Nyarugenge.",
    },
  ];

  return (
    <section
      id="studios"
      className="relative py-24 bg-[#0f0f0f] overflow-hidden"
    >
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-[-5%] w-[45%] h-[45%] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-[-5%] w-[40%] h-[40%] bg-zinc-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 backdrop-blur-[80px] pointer-events-none z-0" />

      <div className="relative z-10 w-full px-[5%]">
        {/* Section Title */}
        <div className="w-full text-center mb-20">
          <h2 className="text-4xl md:text-[4rem] font-bold tracking-tight text-white px-4 leading-tight drop-shadow-xl">
            Discover Top Creative Studios across Kigali
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {districts.map((district) => (
            <Link
              key={district.name}
              href={`/studios?location=${district.name}`}
              className="
                group relative flex flex-col overflow-hidden
                rounded-2xl
                bg-white/[0.02] backdrop-blur-md
                border border-white/60
                ring-1 ring-white/40
                shadow-2xl
                transition-all duration-500
                hover:border-white
                hover:ring-white
                hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]
              "
            >
              <div className="relative h-[40rem] w-full overflow-hidden">
                <Image
                  src={district.image}
                  alt={`${district.name} District`}
                  fill
                  priority
                  className="object-cover h-full w-full transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/95" />

                {/* Center District Name */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <h3 className="text-[3.2rem] uppercase font-black text-white tracking-tight transition-all duration-700 group-hover:scale-105 group-hover:opacity-20 opacity-100 drop-shadow-[0_4px_15px_rgba(0,0,0,1)]">
                    {district.name}
                  </h3>
                </div>

                {/* Bottom Glass Info Box */}
                <div className="absolute bottom-0 left-0 right-0 p-8 pt-12 bg-white/5 backdrop-blur-[60px] border-t border-white/30 transition-all duration-500 group-hover:bg-white/[0.12]">
                  <div className="relative">
                    <h4 className="text-xs font-bold text-white uppercase tracking-[0.4em] mb-3 opacity-70">
                      {district.name}
                    </h4>

                    <p className="text-base leading-relaxed text-white font-medium line-clamp-2 mb-6 drop-shadow-md">
                      {district.description}
                    </p>

                    <div className="flex items-center text-sm font-semibold text-white uppercase tracking-widest">
                      <span className="bg-white/10 px-5 py-2 rounded-full border border-white/30 group-hover:bg-white group-hover:text-black transition-all duration-300">
                        Explore Spaces
                      </span>

                      <span className="ml-3 transition-transform duration-300 group-hover:translate-x-3 text-lg">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
