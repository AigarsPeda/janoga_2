"use client";
import { useEffect, useState } from "react";
import { AdvancedMarker, APIProvider, Map, useApiIsLoaded } from "@vis.gl/react-google-maps";
import { MyMapProps } from "@/types";

interface GoogleMapProps {
  address: string;
  wazeIcon: string;
  googleIcon: string;
  navigationAddress: string;
}

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

const defaultMapOptions = {
  tilt: 0,
  zoomControl: true,
  mapTypeId: "roadmap",
  gestureHandling: "auto",
  mapId: "b4341bc58b07a93d",
};

const MapComponent = ({ address }: MyMapProps) => {
  const apiIsLoaded = useApiIsLoaded();
  const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Allow direct lat,lng string (e.g. "56.968488, 24.164263")
  useEffect(() => {
    if (!address) return;
    const latLngRegex = /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/;
    const match = address.match(latLngRegex);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        setCenter({ lat, lng });
        setError(null);
      }
    }
  }, [address]);

  // Geocode textual address
  useEffect(() => {
    if (!apiIsLoaded) return; // Wait for Google Maps JS API
    if (!address) return;

    // Skip if already parsed as lat,lng
    if (center) return;

    let cancelled = false;
    setIsGeocoding(true);
    setError(null);

    try {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (cancelled) return;
        if (status === "OK" && results && results[0]) {
          const loc = results[0].geometry.location;
          // location is a LatLng object
          setCenter({ lat: loc.lat(), lng: loc.lng() });
        } else {
          setError(`Geocoding failed (${status})`);
        }
        setIsGeocoding(false);
      });
    } catch (e) {
      if (!cancelled) {
        setError("Unexpected error while geocoding");
        setIsGeocoding(false);
      }
    }

    return () => {
      cancelled = true;
    };
  }, [apiIsLoaded, address, center]);

  const effectiveCenter = center || defaultMapCenter; // fallback while loading

  return (
    <div style={{ width: "100%" }}>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
        {(!apiIsLoaded || (isGeocoding && !center)) && (
          <div style={{ padding: "0.5rem 0" }}>Locating address…</div>
        )}
        {error && (
          <div style={{ color: "#b00", fontSize: 12, marginBottom: 4 }}>
            {error}. Showing default location.
          </div>
        )}
        <Map
          center={effectiveCenter}
          zoom={defaultMapZoom}
          mapId="b4341bc58b07a93d"
          style={defaultMapContainerStyle}
        >
          <AdvancedMarker position={effectiveCenter} />
        </Map>
      </APIProvider>
    </div>
  );
};

export { MapComponent };
