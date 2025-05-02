"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import { Sekolah } from "@/types/school";
import L from "leaflet";
import { FaInfoCircle, FaTimes } from "react-icons/fa";
import { RouteInfo } from "@/components/map/RoutingControl";

const DynamicLocationProvider = dynamic(
  () =>
    import("@/contexts/LocationContext").then((mod) => mod.LocationProvider),
  { ssr: false }
);

const Map = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-pulse text-center">
        <div className="text-xl text-white">Loading map...</div>
        <div className="text-sm text-neutral-400">
          Please wait while we initialize the map
        </div>
      </div>
    </div>
  ),
});

export default function HomePage() {
  const [sekolahData, setSekolahData] = useState<Sekolah[]>([]);
  const [filteredType, setFilteredType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [userLocation, setUserLocation] = useState<L.LatLng | null>(null);
  const [activeTab, setActiveTab] = useState<"statistics" | "routing">("statistics");
  const [routeOrigin, setRouteOrigin] = useState<"user" | string | null>(null);
  const [routeDestination, setRouteDestination] = useState<string | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

  const filteredData = filteredType
    ? sekolahData.filter((s) => s.bentuk_pendidikan === filteredType)
    : sekolahData;

  useEffect(() => {
    fetch("/api/sekolah")
      .then((res) => res.json())
      .then((data) => {
        setSekolahData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading sekolah:", err);
        setIsLoading(false);
      });
  }, []);

  const handleMapReady = useCallback((map: L.Map) => {}, []);
  const handleUserLocationUpdate = useCallback((location: L.LatLng) => {
    setUserLocation(location);
  }, []);
  const handleCreateRoute = useCallback((origin: "user" | string | null, destination: string | null) => {
    setRouteOrigin(origin);
    setRouteDestination(destination);
  }, []);
  const handleClearRoute = useCallback(() => {
    setRouteOrigin(null);
    setRouteDestination(null);
    setRouteInfo(null);
  }, []);
  const handleRouteInfoUpdate = useCallback((info: RouteInfo | null) => {
    setRouteInfo(info);
  }, []);

  return (
    <DynamicLocationProvider>
      <main className="h-screen w-screen overflow-hidden relative bg-neutral-950">
        <div className="fixed top-4 right-4 z-[999] flex flex-col gap-3 transition-all duration-300">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl 
              transition-all duration-300 flex items-center justify-center w-12 h-12 border-2 border-white/30"
            aria-label={showSidebar ? "Close Sidebar" : "Open Sidebar"}
          >
            {showSidebar ? (
              <FaTimes className="w-5 h-5" />
            ) : (
              <FaInfoCircle className="w-5 h-5" />
            )}
          </button>
        </div>

        <Sidebar
          isOpen={showSidebar}
          onClose={() => setShowSidebar(false)}
          data={filteredData}
          isLoading={isLoading}
          userLocation={userLocation}
          onCreateRoute={handleCreateRoute}
          onClearRoute={handleClearRoute}
          activeTab={activeTab}
          routeInfo={routeInfo}
          onFilterByEducationType={(type) => setFilteredType(type)}
        />

        <div className="absolute inset-0">
          <Map
            data={filteredData}
            onMapReady={handleMapReady}
            onUserLocationUpdate={handleUserLocationUpdate}
            routeOrigin={routeOrigin}
            routeDestination={routeDestination}
            onRouteInfoUpdate={handleRouteInfoUpdate}
          />
        </div>
      </main>
    </DynamicLocationProvider>
  );
}
