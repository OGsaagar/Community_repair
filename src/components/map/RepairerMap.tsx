"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamic import to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), {
  ssr: false,
});
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

export interface Repairer {
  id: string;
  full_name: string;
  lat: number;
  lng: number;
  avg_rating: number;
  specialties: string[];
}

interface RepairerMapProps {
  repairers: Repairer[];
  clientLat?: number;
  clientLng?: number;
  onSelectRepairer?: (repairer: Repairer) => void;
}

export function RepairerMap({
  repairers,
  clientLat = 40.7128,
  clientLng = -74.006,
  onSelectRepairer,
}: RepairerMapProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-600">Loading map...</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={[clientLat, clientLng]}
      zoom={13}
      style={{ height: "400px", width: "100%", borderRadius: "0.5rem" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* Client location marker */}
      <Marker position={[clientLat, clientLng]}>
        <Popup>Your location</Popup>
      </Marker>

      {/* Repairer markers */}
      {repairers.map((repairer) => (
        <Marker
          key={repairer.id}
          position={[repairer.lat, repairer.lng]}
          eventHandlers={{
            click: () => {
              onSelectRepairer?.(repairer);
            },
          }}
        >
          <Popup>
            <div className="cursor-pointer" onClick={() => onSelectRepairer?.(repairer)}>
              <p className="font-semibold">{repairer.full_name}</p>
              <p className="text-sm">★ {repairer.avg_rating.toFixed(1)}</p>
              <p className="text-xs text-gray-600">{repairer.specialties.join(", ")}</p>
              <button className="mt-2 text-blue-600 text-sm font-semibold">View Profile</button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
