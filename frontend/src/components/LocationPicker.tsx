"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useState, useCallback } from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "0.75rem",
};

const defaultCenter = {
  lat: -1.9441, // Kigali, Rwanda (approximate center as default)
  lng: 30.0619,
};

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

export default function LocationPicker({
  onLocationSelect,
  initialLat,
  initialLng,
}: LocationPickerProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  );

  const onLoad = useCallback(
    (map: google.maps.Map) => {
        if (initialLat && initialLng) {
            const bounds = new window.google.maps.LatLngBounds({
                lat: initialLat,
                lng: initialLng
            });
            map.fitBounds(bounds);
            map.setZoom(15);
        } else {
             // Try to get user location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    map.setCenter(pos);
                    map.setZoom(15);
                });
            }
        }
    },
    [initialLat, initialLng]
  );

  const onUnmount = useCallback(() => {}, []);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarker({ lat, lng });
      onLocationSelect(lat, lng);
    }
  };

  if (!isLoaded) {
    return <div className="w-full h-[400px] bg-gray-100 rounded-xl animate-pulse flex items-center justify-center text-gray-400">Loading Map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={marker || defaultCenter}
      zoom={13}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={handleMapClick}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
      }}
    >
      {marker && <Marker position={marker} />}
    </GoogleMap>
  );
}
