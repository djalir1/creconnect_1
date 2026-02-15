import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import PartnerCard from "./PartnerCard";
import "swiper/css";
import "swiper/css/navigation";
import api from "@/lib/api";

interface Partner {
  id: string;
  name: string;
  location: string;
  image: string;
}

const hardcodedPartners: Partner[] = [
  {
    id: "1",
    name: "Creative Studio One",
    location: "Kicukiro, Kigali",
    image: "/imageSeven.jpg",
  }
];

export default function StudioPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    const fetchPartners = async () => {
        try {
            const res = await api.get("/studios");
            if (res.data && res.data.length > 0) {
                const mapped = res.data.map((s: { id: string, name: string, location: string, images: string[] }) => ({
                    id: s.id,
                    name: s.name,
                    location: s.location,
                    image: (Array.isArray(s.images) && s.images.length > 0) ? s.images[0] : "/imageSeven.jpg"
                }));
                setPartners(mapped);
            } else {
                setPartners(hardcodedPartners);
            }
        } catch (error) {
            console.error("Failed to fetch studio partners:", error);
            setPartners(hardcodedPartners);
        }
    };
    fetchPartners();
  }, []);
  return (
    <section className="py-24 bg-white">
      <div className="w-full px-[5%]">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-black mb-4">
            Top Studio Partners
          </h2>
          <p className="text-lg text-gray-600">
            Discover our trusted studio partners across Kigali
          </p>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              prevEl: ".studio-prev",
              nextEl: ".studio-next",
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
            className="!pb-12"
          >
            {partners.map((partner) => (
              <SwiperSlide key={partner.id}>
                <PartnerCard
                  image={partner.image}
                  name={partner.name}
                  location={partner.location}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button
            className="studio-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-zinc-100 text-zinc-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            className="studio-next absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-zinc-100 text-zinc-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
