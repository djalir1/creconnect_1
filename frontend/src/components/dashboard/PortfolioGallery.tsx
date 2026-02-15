import Image from 'next/image';
import { FaCamera } from 'react-icons/fa';

interface PortfolioImage {
  id: string;
  url: string;
  alt: string;
}

interface PortfolioGalleryProps {
  images: PortfolioImage[];
}

export default function PortfolioGallery({ images }: PortfolioGalleryProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-100 rounded-lg">
          <FaCamera className="text-indigo-600 text-xl" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Portfolio</h3>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-3 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
}
