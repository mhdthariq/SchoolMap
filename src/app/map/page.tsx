"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import { Sekolah } from "@/types/school";
import L from "leaflet";
import Link from "next/link";
import { FaRoute, FaChartBar, FaHome } from "react-icons/fa";
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

export default function MapPage() {
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
  const [schoolTypeFilter, setSchoolTypeFilter] = useState<string | null>(null);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [initialPosition, setInitialPosition] = useState<
    [number, number] | null
  >(null);
  // Handle URL query parameters
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);

      const schoolId = params.get("schoolId");
      if (schoolId) {
        setSelectedSchoolId(schoolId);
      }

      const lat = params.get("lat");
      const lng = params.get("lng");

      if (lat && lng) {
        try {
          const latValue = parseFloat(lat);
          const lngValue = parseFloat(lng);
          if (!isNaN(latValue) && !isNaN(lngValue)) {
            setInitialPosition([latValue, lngValue]);
          }
        } catch (error) {
          console.error("Invalid lat/lng parameters:", error);
        }
      }
    }
  }, []);

  // Add data fetching
  useEffect(() => {
    fetch("/api/sekolah")
      .then((res) => res.json())
      .then((data) => {
        setSekolahData(data);

        // If we have a selected school ID from URL, find and focus on that school
        if (selectedSchoolId) {
          const selectedSchool = data.find(
            (school: Sekolah) => school.uuid === selectedSchoolId
          );
          if (selectedSchool) {
            // We'll handle the focus in the Map component
          }
        }

        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading sekolah:", err);
        setIsLoading(false);
      });
  }, [selectedSchoolId]);

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

  // Handle tab change without closing the sidebar
  const handleTabChange = useCallback((tab: "statistics" | "routing") => {
    setActiveTab(tab);
  }, []);

  // Close sidebar only when clicking outside the sidebar and navigation buttons
  const handleSidebarClose = useCallback((event: MouseEvent) => {
    // Check if the click was on the statistics or routing buttons
    const target = event.target as HTMLElement;
    const isNavButton = target.closest('[data-nav-button="true"]');

    // Only close if not clicking on the navigation buttons
    if (!isNavButton) {
      setShowSidebar(false);
    }
  }, []);

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
            data-nav-button="true"
            className={`bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-lg border transition-all duration-300 
              hover:bg-white hover:shadow-xl flex items-center justify-center w-10 h-10
              ${
                activeTab === "statistics" && showSidebar
                  ? "border-blue-500 ring-2 ring-blue-300"
                  : "border-neutral-200"
              }`}
            aria-label="School Statistics"
          >
            <FaChartBar
              className={`w-5 h-5 ${
                activeTab === "statistics" && showSidebar
                  ? "text-blue-600"
                  : "text-neutral-900"
              }`}
            />
          </button>

          <button
            onClick={() => openSidebar("routing")}
            data-nav-button="true"
            className={`bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-lg border transition-all duration-300 
              hover:bg-white hover:shadow-xl flex items-center justify-center w-10 h-10
              ${
                activeTab === "routing" && showSidebar
                  ? "border-indigo-500 ring-2 ring-indigo-300"
                  : "border-neutral-200"
              }`}
            aria-label="Routing Control"
          >
            <FaRoute
              className={`w-5 h-5 ${
                activeTab === "routing" && showSidebar
                  ? "text-indigo-600"
                  : "text-neutral-900"
              }`}
            />
          </button>

          {/* Home button linking to the homepage */}
          <Link href="/" passHref>
            <button
              data-nav-button="true"
              className={`bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-lg border transition-all duration-300 
                hover:bg-white hover:shadow-xl flex items-center justify-center w-10 h-10
                border-neutral-200`}
              aria-label="Home"
            >
              <FaHome className="w-5 h-5 text-neutral-900" />
            </button>
          </Link>
        </div>
        <Sidebar
          isOpen={showSidebar}
          onClose={handleSidebarClose}
          data={sekolahData}
          isLoading={isLoading}
          userLocation={userLocation}
          onCreateRoute={handleCreateRoute}
          onClearRoute={handleClearRoute}
          activeTab={activeTab}
          routeInfo={routeInfo}
          onSchoolTypeFilter={setSchoolTypeFilter}
          activeFilter={schoolTypeFilter}
          onTabChange={handleTabChange}
        />{" "}
        <div className="absolute inset-0">
          <Map
            data={sekolahData}
            onMapReady={handleMapReady}
            onUserLocationUpdate={handleUserLocationUpdate}
            routeOrigin={routeOrigin}
            routeDestination={routeDestination}
            onRouteInfoUpdate={handleRouteInfoUpdate}
            schoolTypeFilter={schoolTypeFilter}
            initialPosition={initialPosition}
            selectedSchoolId={selectedSchoolId}
          />
        </div>
      </main>
    </DynamicLocationProvider>
  );
}
