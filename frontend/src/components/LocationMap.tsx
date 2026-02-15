"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { memo } from "react";

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "0.75rem",
};

interface LocationMapProps {
  lat: number;
  lng: number;
}

function LocationMap({ lat, lng }: LocationMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const center = { lat, lng };

  if (!isLoaded) {
    return <div className="w-full h-[300px] bg-gray-100 rounded-xl animate-pulse"></div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        zoomControl: true,
        fullscreenControl: true,
      }}
    >
      <Marker position={center} />
    </GoogleMap>
  );
}

export default memo(LocationMap);
