"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import { Sekolah } from "@/types/school";
import L from "leaflet";
import { FaRoute, FaChartBar } from "react-icons/fa";
import { RouteInfo } from "@/components/map/RoutingControl";

// Import LocationProvider dynamically to avoid SSR issues
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
  const [isLoading, setIsLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [userLocation, setUserLocation] = useState<L.LatLng | null>(null);
  const [activeTab, setActiveTab] = useState<"statistics" | "routing">(
    "statistics"
  );
  const [routeOrigin, setRouteOrigin] = useState<"user" | string | null>(null);
  const [routeDestination, setRouteDestination] = useState<string | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

  // Add data fetching
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

  // Handle map reference
  const handleMapReady = useCallback((map: L.Map) => {
    // We can remove the mapRef state since it's not being used elsewhere
  }, []);

  // Handle user location update
  const handleUserLocationUpdate = useCallback((location: L.LatLng) => {
    setUserLocation(location);
  }, []);

  // Handle route creation
  const handleCreateRoute = useCallback(
    (origin: "user" | string | null, destination: string | null) => {
      setRouteOrigin(origin);
      setRouteDestination(destination);
    },
    []
  );

  // Handle route clearing
  const handleClearRoute = useCallback(() => {
    setRouteOrigin(null);
    setRouteDestination(null);
    setRouteInfo(null);
  }, []);

  // Handle route info update
  const handleRouteInfoUpdate = useCallback((info: RouteInfo | null) => {
    setRouteInfo(info);
  }, []);

  // Handle opening the sidebar with the specified tab
  const openSidebar = (tab: "statistics" | "routing") => {
    setActiveTab(tab);
    setShowSidebar(true);
  };

  return (
    <DynamicLocationProvider>
      <main className="h-screen w-screen overflow-hidden relative bg-neutral-950">
        {/* Medium-sized floating buttons with increased spacing */}
        <div
          className={`fixed top-4 right-4 z-50 flex flex-col gap-3 transition-all duration-300 ${
            showSidebar ? "-translate-x-64" : "translate-x-0"
          }`}
        >
          <button
            onClick={() => openSidebar("statistics")}
            className="bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-lg border border-neutral-200 transition-all duration-300 
              hover:bg-white hover:shadow-xl flex items-center justify-center w-10 h-10"
            aria-label="School Statistics"
          >
            <FaChartBar className="w-5 h-5 text-neutral-900" />
          </button>

          <button
            onClick={() => openSidebar("routing")}
            className="bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-lg border border-neutral-200 transition-all duration-300 
              hover:bg-white hover:shadow-xl flex items-center justify-center w-10 h-10"
            aria-label="Routing Control"
          >
            <FaRoute className="w-5 h-5 text-neutral-900" />
          </button>
        </div>

        <Sidebar
          isOpen={showSidebar}
          onClose={() => setShowSidebar(false)}
          data={sekolahData}
          isLoading={isLoading}
          userLocation={userLocation}
          onCreateRoute={handleCreateRoute}
          onClearRoute={handleClearRoute}
          activeTab={activeTab}
          routeInfo={routeInfo}
        />

        <div className="absolute inset-0">
          <Map
            data={sekolahData}
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
