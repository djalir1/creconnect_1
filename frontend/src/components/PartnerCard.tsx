import Image from "next/image";

interface PartnerCardProps {
  image: string;
  name: string;
  location: string;
}

export default function PartnerCard({ image, name, location }: PartnerCardProps) {
  return (
    <div className="flex flex-col items-center justify-center px-3 py-6 group border-2 rounded-md cursor-pointer shadow-lg group-hover:shadow-xl">
      <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-zinc-200 group-hover:border-zinc-400 transition-all duration-300">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-1 text-center">{name}</h3>
      <p className="text-sm text-gray-600 text-center">{location}</p>
    </div>
  );
}
