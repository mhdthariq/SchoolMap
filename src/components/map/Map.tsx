import { useRef, useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L, { Map as LeafletMap, LatLng } from "leaflet";
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

// Marker Icons
const defaultIcon = L.icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
} as any);

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

const originIcon = L.icon({
  iconUrl: "/marker/marker-icon-green.png",
  iconRetinaUrl: "/marker/marker-icon-2x-green.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
} as any);

const locationIcon = L.icon({
  iconUrl: "/marker/location.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
} as any);

function MapController({ map }: { map: LeafletMap | null }) {
  const leafletMap = useMap();
  useEffect(() => {
    if (!map) leafletMap.setView([3.5952, 98.6722], 13);
  }, [map, leafletMap]);
  return null;
}

interface MapProps {
  data: Sekolah[];
  onMapReady?: (map: LeafletMap) => void;
  onUserLocationUpdate?: (location: LatLng) => void;
  routeOrigin?: "user" | string | null;
  routeDestination?: string | null;
  onRouteInfoUpdate?: (routeInfo: RouteInfo | null) => void;
}

export default function Map({
  data,
  onMapReady,
  onUserLocationUpdate,
  routeOrigin,
  routeDestination,
  onRouteInfoUpdate,
}: MapProps) {
  const [mapLayer, setMapLayer] = useState<keyof typeof MAP_LAYERS>("osm");
  const [selectedSchool, setSelectedSchool] = useState<Sekolah | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const { userLocation } = useLocation();
  const isRoutingActive = routeOrigin !== null && routeDestination !== null;

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current && onMapReady) {
      onMapReady(mapRef.current);
    }

    // ✅ FIXED: safely override marker icon without TS error
    // @ts-ignore
    L.Marker.prototype.options.icon = defaultIcon;
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

  const getSubdomains = (
    layer: (typeof MAP_LAYERS)[keyof typeof MAP_LAYERS]
  ) => (layer.subdomains ? { subdomains: layer.subdomains } : {});

  const shouldShowSchool = (school: Sekolah) => {
    if (selectedSchool) return selectedSchool.uuid === school.uuid;
    if (isRoutingActive)
      return school.uuid === routeOrigin || school.uuid === routeDestination;
    return true;
  };

  const getSchoolIcon = (school: Sekolah) => {
    if (selectedSchool?.uuid === school.uuid) return redMarkerIcon;
    if (school.uuid === routeOrigin) return originIcon;
    if (school.uuid === routeDestination) return originIcon;

    if (school.bentuk_pendidikan?.includes("SD")) return iconSD;
    if (school.bentuk_pendidikan?.includes("SMP")) return iconSMP;
    if (school.bentuk_pendidikan?.includes("SMA")) return iconSMA;

    return defaultIcon;
  };

  return (
    <div className="w-full h-full relative">
      <SchoolSearch
        data={data}
        onSchoolSelect={handleSchoolSelect}
        onSearchReset={handleSearchReset}
      />
      <LayerSwitcher
        currentLayer={mapLayer}
        onLayerChange={(layer: keyof typeof MAP_LAYERS) =>
          setMapLayer(layer)
        }
      />

      <MapContainer
        center={[3.5952, 98.6722]}
        zoom={13}
        scrollWheelZoom
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
        ref={(map) => {
          mapRef.current = map || null;
        }}
      >
        <MapController map={mapRef.current} />
        <TileLayer
          url={MAP_LAYERS[mapLayer].url}
          attribution={MAP_LAYERS[mapLayer].attribution}
          {...getSubdomains(MAP_LAYERS[mapLayer])}
        />

        {data.filter(shouldShowSchool).map((school) => (
          <Marker
            key={school.uuid}
            position={[school.lat, school.lng]}
            icon={getSchoolIcon(school)}
            eventHandlers={{
              click: () => setSelectedSchool(school),
              popupclose: () => setSelectedSchool(null),
            }}
          >
            <SchoolPopup school={school} />
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

        {userLocation &&
          (!isRoutingActive || routeOrigin === "user") && (
            <Marker
              position={userLocation}
              icon={routeOrigin === "user" ? originIcon : locationIcon}
            >
              <LocationPopup location={userLocation} />
            </Marker>
          )}
      </MapContainer>

      <style jsx global>{`
        .leaflet-routing-container {
          z-index: 999 !important;
        }
        .leaflet-routing-container-hide {
          display: none !important;
        }
        .leaflet-control-container {
          background: transparent !important;
        }
      `}</style>
    </div>
  );
}
