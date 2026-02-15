// src/lib/mockData.ts
export interface Studio {
  id: string;
  name: string;
  location: string;
  description: string;
  pricePerHour: number;
  images: string[];
  features: string[];
  availability: "available" | "away" | "out";
}

export const initialStudios: Studio[] = [
  {
    id: "1",
    name: "Elite Sound Studio",
    location: "Kicukiro",
    description: "Professional recording space with top-tier gear.",
    pricePerHour: 50000,
    images: ["/background.jpeg"],
    features: ["WiFi", "Parking"],
    availability: "available"
  },
  {
    id: "2",
    name: "Gasabo Creative Hub",
    location: "Gasabo",
    description: "Perfect for photography and video shoots.",
    pricePerHour: 35000,
    images: ["/background.jpeg"],
    features: ["Air Conditioning", "Green Screen"],
    availability: "available"
  }
];