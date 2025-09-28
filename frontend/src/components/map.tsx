"use client";
import { MyMapProps } from "@/types";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useEffect, useRef, useState } from "react";

interface GoogleMapProps {
  address: string;
  wazeIcon: string;
  googleIcon: string;
  navigationAddress: string;
}

// Static libraries array to prevent unnecessary reloads
const libraries: "marker"[] = ["marker"];

// Map's styling
export const defaultMapContainerStyle = {
  width: "100%",
  height: "48vh",
  maxHeight: "600px",
};

const defaultMapCenter = {
  lat: 35.8799866,
  lng: 76.5048004,
};

const defaultMapZoom = 15;

// const defaultMapOptions = {
//   tilt: 0,
//   zoomControl: true,
//   mapTypeId: "roadmap",
//   gestureHandling: "auto",
//   mapId: "b4341bc58b07a93d",
// };

const MapComponent = ({ address }: MyMapProps | { address: string }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries, // Use the static libraries array
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(defaultMapCenter);
  const [error, setError] = useState<string | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  // Check if address is already lat,lng coordinates
  const parseLatLng = (addr: string): google.maps.LatLngLiteral | null => {
    if (!addr) return null;
    const latLngRegex = /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/;
    const match = addr.match(latLngRegex);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
    return null;
  };

  // Geocode the address
  useEffect(() => {
    if (!isLoaded || !address) return;

    // Check if it's already coordinates
    const coords = parseLatLng(address);
    if (coords) {
      setCenter(coords);
      setError(null);
      return;
    }

    // Need geocoding
    const geocoder = new window.google.maps.Geocoder();
    setIsGeocoding(true);
    setError(null);

    geocoder.geocode({ address }, (results, status) => {
      setIsGeocoding(false);

      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        const newCenter = {
          lat: location.lat(),
          lng: location.lng(),
        };
        setCenter(newCenter);
        setError(null);
      } else {
        setError(`Geocoding failed: ${status}`);
        console.error("Geocoding failed:", status, address);
      }
    });
  }, [isLoaded, address]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    // Clean up the marker when map unmounts
    if (markerRef.current) {
      markerRef.current.map = null;
      markerRef.current = null;
    }
    setMap(null);
  }, []);

  // Create/update AdvancedMarkerElement when map or center changes
  useEffect(() => {
    if (!map || !window.google?.maps?.marker) return;

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.map = null;
    }

    // Create new AdvancedMarkerElement
    markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
      map,
      position: center,
    });

    return () => {
      if (markerRef.current) {
        markerRef.current.map = null;
      }
    };
  }, [map, center]);

  if (!isLoaded) {
    return (
      <div style={defaultMapContainerStyle}>
        <div style={{ padding: "1rem", textAlign: "center" }}>Loading map...</div>
      </div>
    );
  }

  return (
    <div
      style={{ width: "100%" }}
      className="rounded-xl overflow-hidden shadow-lg border-border/60"
    >
      {isGeocoding && <div style={{ padding: "0.5rem 0" }}>Locating "{address}"…</div>}
      {error && (
        <div style={{ color: "#b00", fontSize: 12, marginBottom: 4 }}>
          {error}. Showing default location.
        </div>
      )}
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={center}
        zoom={defaultMapZoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          zoomControl: true,
          gestureHandling: "auto",
          mapTypeId: "roadmap",
          mapId: "645d9f609f2f0a986ee4a052", // b4341bc58b07a93d
        }}
      >
        {/* AdvancedMarkerElement is created via useEffect, no JSX component needed */}
      </GoogleMap>
      {address && (
        <div className="p-4 bg-neutral-900/30 border-t border-border/60">
          <div className="flex items-start gap-2">
            <div>
              <div className="flex items-start gap-2 mb-3">
                <svg
                  className="w-5 h-5 text-neutral-100 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-sm text-neutral-100 leading-relaxed mb-3">{address}</p>
              </div>

              {/* Navigation buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const encodedAddress = encodeURIComponent(address);
                    window.open(`https://maps.google.com/maps?q=${encodedAddress}`, "_blank");
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 13.8c-.29.718-.664 1.39-1.109 1.996-.445.606-.96 1.144-1.532 1.596-.858.678-1.849 1.155-2.927 1.155s-2.069-.477-2.927-1.155c-.572-.452-1.087-.99-1.532-1.596-.445-.606-.819-1.278-1.109-1.996C5.851 13.082 5.7 12.547 5.7 12c0-3.526 2.774-6.3 6.3-6.3s6.3 2.774 6.3 6.3c0 .547-.151 1.082-.732 1.8zM12 7.2c-2.652 0-4.8 2.148-4.8 4.8 0 2.652 2.148 4.8 4.8 4.8s4.8-2.148 4.8-4.8c0-2.652-2.148-4.8-4.8-4.8zm0 7.2c-1.326 0-2.4-1.074-2.4-2.4s1.074-2.4 2.4-2.4 2.4 1.074 2.4 2.4-1.074 2.4-2.4 2.4z" />
                  </svg>
                  Google Maps
                </button>

                <button
                  onClick={() => {
                    const encodedAddress = encodeURIComponent(address);
                    window.open(`https://maps.apple.com/?q=${encodedAddress}`, "_blank");
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-800 text-white rounded-md transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  Apple Maps
                </button>

                <button
                  onClick={() => {
                    const encodedAddress = encodeURIComponent(address);
                    window.open(`https://waze.com/ul?q=${encodedAddress}`, "_blank");
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.11 14.48c-1.53 2.61-4.83 5.01-8.11 5.52-3.28-.51-6.58-2.91-8.11-5.52C2.36 12.74 2 10.82 2 8.98 2 4.03 6.03 0 11 0s9 4.03 9 8.98c0 1.84-.36 3.76-1.89 5.5zM12 6.5c.69 0 1.25-.56 1.25-1.25S12.69 4 12 4s-1.25.56-1.25 1.25S11.31 6.5 12 6.5zm-2.75 5.25c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25S8 9.81 8 10.5s.56 1.25 1.25 1.25zm5.5 0c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25-1.25.56-1.25 1.25.56 1.25 1.25 1.25zM12 15.5c1.24 0 2.25-1.01 2.25-2.25H9.75c0 1.24 1.01 2.25 2.25 2.25zm0 3c-2.07 0-3.75-1.68-3.75-3.75h7.5c0 2.07-1.68 3.75-3.75 3.75z" />
                  </svg>
                  Waze
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { MapComponent };
