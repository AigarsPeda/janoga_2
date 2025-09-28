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
      className="rounded-xl overflow-hidden shadow-lg border border-border/60"
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

      {/* Address display below the map */}
      {address && (
        <div className="p-4 bg-background border-t border-border/60">
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
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
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
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
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
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
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
