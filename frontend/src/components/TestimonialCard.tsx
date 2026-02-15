import Image from "next/image";

interface TestimonialCardProps {
  quote: string;
  image: string;
  person: string;
  title: string;
  isDark: boolean;
}

export default function TestimonialCard({ quote, image, person, title, isDark }: TestimonialCardProps) {
  return (
    <div className={`p-8 rounded-lg shadow-lg ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Quote Icon */}
      <div className="mb-6">
        <svg
          className={`w-12 h-12 ${isDark ? 'text-white/20' : 'text-black/20'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>

      {/* Testimonial Content */}
      <p className={`text-lg mb-8 leading-relaxed ${isDark ? 'text-white/90' : 'text-black/90'}`}>
        {quote}
      </p>

      {/* Person Info */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-300">
          <Image
            src={image}
            alt={person}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-black'}`}>
            {person}
          </h4>
          <p className={`text-sm ${isDark ? 'text-white/70' : 'text-black/70'}`}>
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}
