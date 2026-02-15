import { useState, useEffect } from "react";
import { Parisienne } from "next/font/google";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import TestimonialCard from "./TestimonialCard";
import "swiper/css";
import "swiper/css/navigation";
import api from "@/lib/api";

const parisienne = Parisienne({
  subsets: ["latin"],
  variable: "--font-parisienne",
  weight: ["400"],
});

interface Testimonial {
  id: string;
  quote: string;
  image: string;
  person: string;
  title: string;
}

const hardcodedTestimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "Working with this studio was an absolute pleasure. The team's professionalism and creativity exceeded our expectations. They brought our vision to life!",
    image: "/imageFour.jpg",
    person: "Sarah Johnson",
    title: "CEO, Creative Agency",
  },
  {
    id: "2",
    quote:
       "The venue was perfect for our corporate event. The staff was incredibly helpful and the facilities were top-notch. Highly recommend!",
    image: "/imageFive.jpg",
    person: "Michael Chen",
    title: "Event Manager",
  },
  {
    id: "3",
    quote:
      "Amazing experience from start to finish. The attention to detail and quality of service is unmatched. Will definitely be returning!",
    image: "/imageSix.jpg",
    person: "Emily Rodriguez",
    title: "Verified Client",
  }
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
        try {
            const res = await api.get("/reviews");
            if (res.data && res.data.length > 0) {
                const mapped = res.data.map((r: { id: string, comment: string, user?: { name: string, avatar: string } }) => ({
                    id: r.id,
                    quote: r.comment || "No comment provided",
                    image: r.user?.avatar || "/imageFour.jpg",
                    person: r.user?.name || "Anonymous",
                    title: "Verified User"
                }));
                setTestimonials(mapped);
            } else {
                setTestimonials(hardcodedTestimonials);
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
            setTestimonials(hardcodedTestimonials);
        }
    };
    fetchReviews();
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="w-full px-[5%]">
        <div className="title mb-16">
          <h2
            className={`text-3xl font-black text-center mb-4 ${parisienne.className}`}
          >
            Testimonials
          </h2>
          <p className="text-center text-4xl font-bold tracking-tight text-black">
            What our clients say about us
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              prevEl: ".testimonial-prev",
              nextEl: ".testimonial-next",
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop={true}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="!pb-12"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={testimonial.id}>
                <TestimonialCard
                  quote={testimonial.quote}
                  image={testimonial.image}
                  person={testimonial.person}
                  title={testimonial.title}
                  isDark={index % 2 === 0}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button
            className="testimonial-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-zinc-100 text-zinc-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Previous testimonial"
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
            className="testimonial-next absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-zinc-100 text-zinc-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Next testimonial"
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
