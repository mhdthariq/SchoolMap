/* eslint spellcheck/disable: Sekolah sekolah alamat jumlah murid guru bentuk pendidikan */
import { useRef, useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Sekolah } from "@/types/school";
import LayerSwitcher, { MAP_LAYERS } from "./LayerSwitcher";
import SchoolPopup from "./SchoolPopup";
import SchoolSearch from "./SchoolSearch";
import LocationControl from "./LocationControl";
import PolygonControl from "./PolygonControl";
import RoutingControl, { RouteInfo } from "./RoutingControl";
import { useLocation } from "@/contexts/LocationContext";
import LocationPopup from "./LocationPopup";

// Create marker icons after import with proper type assertion
const defaultIcon = L.icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
} as any); // Use 'any' to bypass type checking for icon properties

// Add type-specific school icons
const iconSD = L.icon({
  iconUrl: "/marker/marker-icon-blue.png",
  iconRetinaUrl: "/marker/marker-icon-2x-blue.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
} as any);

const iconSMP = L.icon({
  iconUrl: "/marker/marker-icon-green.png",
  iconRetinaUrl: "/marker/marker-icon-2x-green.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
} as any);

const iconSMA = L.icon({
  iconUrl: "/marker/marker-icon-violet.png",
  iconRetinaUrl: "/marker/marker-icon-2x-violet.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
} as any);

const redMarkerIcon = L.icon({
  iconUrl: "/marker/marker-icon-red.png",
  iconRetinaUrl: "/marker/marker-icon-2x-red.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
} as any);

// Add location icon for user location marker
const locationIcon = L.icon({
  iconUrl: "/marker/location.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
} as any); // Use 'any' to bypass type checking for icon properties

// Add origin and destination icons for routing
const originIcon = L.icon({
  iconUrl: "/marker/marker-icon-yellow.png",
  iconRetinaUrl: "/marker/marker-icon-2x-yellow.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
} as any);

const destinationIcon = L.icon({
  iconUrl: "/marker/marker-icon-yellow.png",
  iconRetinaUrl: "/marker/marker-icon-2x-yellow.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
} as any);

// Add MapController component to handle map reference and initial position
interface MapControllerProps {
  map: L.Map | null;
  initialPosition: [number, number] | null;
  zoomLevel?: number;
}

function MapController({
  map,
  initialPosition,
  zoomLevel = 16,
}: MapControllerProps) {
  const leafletMap = useMap();

  useEffect(() => {
    // Set default view if there's no map reference
    if (map === null) {
      // Use initialPosition if provided, otherwise use default center
      if (initialPosition) {
        leafletMap.setView(initialPosition, zoomLevel);
      } else {
        leafletMap.setView([3.5952, 98.6722], 13);
      }
    }
  }, [map, leafletMap, initialPosition, zoomLevel]);

  return null;
}

interface MapProps {
  data: Sekolah[];
  onMapReady?: (map: L.Map) => void;
  onUserLocationUpdate?: (location: L.LatLng) => void;
  routeOrigin?: "user" | string | null; // Changed from number to string
  routeDestination?: string | null; // Changed from number to string
  onRouteInfoUpdate?: (routeInfo: RouteInfo | null) => void;
  // Add new prop for filtering
  schoolTypeFilter: string | null;
  kelurahanFilter?: number | null;
  // Add new props for direct school focusing from URL
  initialPosition?: [number, number] | null;
  selectedSchoolId?: string | null;
}

export default function Map({
  data,
  onMapReady,
  onUserLocationUpdate,
  routeOrigin,
  routeDestination,
  onRouteInfoUpdate,
  schoolTypeFilter,
  kelurahanFilter,
  initialPosition,
  selectedSchoolId,
}: MapProps) {
  // Use type assertion for MapLayerType to fix the useState type issue
  const [mapLayer, setMapLayer] = useState<keyof typeof MAP_LAYERS>("osm");
  const [selectedSchool, setSelectedSchool] = useState<Sekolah | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const { userLocation } = useLocation();

  // Determine if we're in routing mode
  const isRoutingActive = routeOrigin !== null && routeDestination !== null;

  // Filter schools based on schoolTypeFilter
  const filteredSchools = schoolTypeFilter
    ? data.filter((school) => school.bentuk_pendidikan === schoolTypeFilter)
    : data;
  // Handle focusing on a school passed through URL
  useEffect(() => {
    if (selectedSchoolId && data.length > 0) {
      // Find the selected school by ID
      const school = data.find((s) => s.uuid === selectedSchoolId);
      if (school) {
        // Focus on this school
        setSelectedSchool(school);
      }
    }
  }, [data, selectedSchoolId]);

  useEffect(() => {
    // Initialize leaflet
    if (typeof window !== "undefined") {
      // Set default icon for all markers
      try {
        // @ts-ignore - Ignore TypeScript errors for Marker prototype
        if (L.Marker && L.Marker.prototype && L.Marker.prototype.options) {
          // @ts-ignore - Ignore TypeScript errors for Marker prototype options
          L.Marker.prototype.options.icon = defaultIcon;
        }
      } catch (e) {
        console.error("Error setting default marker icon:", e);
      }

      // Add location found event handler
      if (mapRef.current && onMapReady) {
        onMapReady(mapRef.current);
      }
    }
  }, [onMapReady]);

  const handleSchoolSelect = useCallback((school: Sekolah) => {
    if (mapRef.current) {
      mapRef.current.setView([school.lat, school.lng], 16);
      setSelectedSchool(school);
    }
  }, []);

  const handleSearchReset = useCallback(() => {
    setSelectedSchool(null);
    if (mapRef.current) {
      mapRef.current.setView([3.5952, 98.6722], 13);
    }
  }, []);

  // Default center coordinates
  const defaultCenter: [number, number] = [3.5952, 98.6722];

  // Helper function to extract subdomains if they exist
  const getSubdomains = (
    layer: (typeof MAP_LAYERS)[keyof typeof MAP_LAYERS]
  ) => {
    // @ts-ignore - Ignore TypeScript errors for subdomains property
    return layer.subdomains ? { subdomains: layer.subdomains } : {};
  };

  // Helper function to determine if a school should be shown
  const shouldShowSchool = (school: Sekolah) => {
    // First, check kelurahan filter if active
    if (kelurahanFilter && school.kelurahan_id !== kelurahanFilter) {
      return false;
    }

    // If a school type filter is active, only show schools of that type
    if (schoolTypeFilter && school.bentuk_pendidikan !== schoolTypeFilter) {
      return false;
    }

    // If a school is selected, only show that school
    if (selectedSchool !== null) {
      return selectedSchool.uuid === school.uuid;
    }

    // If routing is active, only show origin and destination schools
    if (isRoutingActive) {
      return routeOrigin === school.uuid || routeDestination === school.uuid;
    }

    // Otherwise, show all schools (that match the current type filter if any)
    return true;
  };

  // Helper function to get the appropriate icon for a school
  const getSchoolIcon = (school: Sekolah) => {
    if (selectedSchool?.uuid === school.uuid) {
      return redMarkerIcon;
    }

    if (routeOrigin === school.uuid) {
      return originIcon;
    }

    if (routeDestination === school.uuid) {
      return destinationIcon;
    }

    // Use type-specific icons based on school type
    if (school.bentuk_pendidikan?.includes("SD")) return iconSD;
    if (school.bentuk_pendidikan?.includes("SMP")) return iconSMP;
    if (school.bentuk_pendidikan?.includes("SMA")) return iconSMA;

    return defaultIcon;
  };

  return (
    <div className="w-full h-full relative">
      <SchoolSearch
        data={filteredSchools} // Use filtered schools for search
        onSchoolSelect={handleSchoolSelect}
        onSearchReset={handleSearchReset}
      />
      {/* @ts-ignore - Ignore TypeScript errors for LayerSwitcher props */}
      <LayerSwitcher
        currentLayer={mapLayer}
        onLayerChange={(layer: keyof typeof MAP_LAYERS) => setMapLayer(layer)}
      />{" "}
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
        className="z-0 [&_.leaflet-popup-content-wrapper]:bg-neutral-900/95 [&_.leaflet-popup-content-wrapper]:backdrop-blur-xl 
          [&_.leaflet-popup-content-wrapper]:text-white [&_.leaflet-popup-content-wrapper]:shadow-2xl 
          [&_.leaflet-popup-content-wrapper]:border [&_.leaflet-popup-content-wrapper]:border-neutral-800/50 
          [&_.leaflet-popup-tip]:bg-neutral-900/95"
        ref={(map) => {
          mapRef.current = map || null;
        }}
      >
        <MapController
          map={mapRef.current}
          initialPosition={
            initialPosition ||
            (selectedSchool ? [selectedSchool.lat, selectedSchool.lng] : null)
          }
          zoomLevel={16}
        />

        {/* @ts-ignore - Ignore TypeScript errors for TileLayer props */}
        <TileLayer
          url={MAP_LAYERS[mapLayer].url}
          attribution={MAP_LAYERS[mapLayer].attribution}
          {...getSubdomains(MAP_LAYERS[mapLayer])}
        />

        {data.filter(shouldShowSchool).map((sekolah) => (
          <Marker
            key={sekolah.uuid}
            position={[sekolah.lat, sekolah.lng]}
            icon={getSchoolIcon(sekolah)}
            eventHandlers={{
              click: () => {
                setSelectedSchool(sekolah);
              },
              popupclose: () => {
                setSelectedSchool(null);
              },
            }}
          >
            <SchoolPopup school={sekolah} />
          </Marker>
        ))}

        <PolygonControl />
        <LocationControl onLocationUpdate={onUserLocationUpdate} />
        <RoutingControl
          userLocation={userLocation}
          schools={data}
          origin={routeOrigin}
          destination={routeDestination}
          onRouteInfoUpdate={onRouteInfoUpdate}
        />

        {userLocation && (!isRoutingActive || routeOrigin === "user") && (
          <Marker
            position={userLocation}
            icon={routeOrigin === "user" ? originIcon : locationIcon}
          >
            <LocationPopup location={userLocation} />
          </Marker>
        )}
      </MapContainer>
      {/* Add styling to fix z-index issues with routing containers */}
      <style jsx global>{`
        .leaflet-routing-container {
          z-index: 999 !important;
        }

        .leaflet-routing-container-hide {
          display: none !important;
        }

        /* Ensure the container doesn't create a white box */
        .leaflet-control-container {
          background: transparent !important;
        }
      `}</style>
    </div>
  );
}
