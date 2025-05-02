import { useEffect, useRef, useState } from "react";
import { Sekolah } from "@/types/school";
import L from "leaflet";
import RoutingSidebar from "./map/RoutingSidebar";
import { FaRoute } from "react-icons/fa6";
import { RouteInfo } from "./map/RoutingControl"; // Add this import for RouteInfo

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  data: Sekolah[];
  isLoading: boolean;
  userLocation: L.LatLng | null;
  activeTab?: "statistics" | "routing";
  onCreateRoute: (
    origin: "user" | string | null,
    destination: string | null
  ) => void;
  onClearRoute: () => void;
  routeInfo?: RouteInfo | null;
}

export default function Sidebar({
  isOpen,
  onClose,
  data,
  isLoading,
  userLocation,
  activeTab = "statistics",
  onCreateRoute,
  onClearRoute,
  routeInfo,
}: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [currentTab, setCurrentTab] = useState<"statistics" | "routing">(
    activeTab
  );

  // Update local tab state when prop changes
  useEffect(() => {
    if (activeTab) {
      setCurrentTab(activeTab);
    }
  }, [activeTab]);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const schoolCounts = {
    SD: data.filter((s) => s.bentuk_pendidikan === "SD").length,
    SMP: data.filter((s) => s.bentuk_pendidikan === "SMP").length,
    SMA: data.filter((s) => s.bentuk_pendidikan === "SMA").length,
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-40 transform transition-transform duration-300 border-l border-neutral-200 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {currentTab === "routing" ? (
        <RoutingSidebar
          schools={data}
          userLocation={userLocation}
          onClose={() => setCurrentTab("statistics")}
          onCreateRoute={onCreateRoute}
          onClearRoute={onClearRoute}
          routeInfo={routeInfo}
        />
      ) : (
        <div className="p-6 space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <span className="text-2xl">📍</span>
            </div>
            <div className="text-lg font-bold text-neutral-800">
              Peta Sekolah
            </div>
          </div>

          {/* Region Info */}
          <div>
            <h2 className="text-sm font-medium text-neutral-500">Wilayah</h2>
            <p className="text-neutral-800 text-lg mt-1">
              Kecamatan Medan Denai
            </p>
          </div>

          {/* School Statistics */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-neutral-500">
              Statistik Sekolah
            </h2>

            <div className="grid gap-3">
              <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                <div className="text-xs text-neutral-500">
                  Sekolah Dasar (SD)
                </div>
                <div className="text-2xl font-bold text-blue-600 mt-1">
                  {schoolCounts.SD}
                </div>
              </div>

              <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                <div className="text-xs text-neutral-500">
                  Sekolah Menengah Pertama (SMP)
                </div>
                <div className="text-2xl font-bold text-emerald-600 mt-1">
                  {schoolCounts.SMP}
                </div>
              </div>

              <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                <div className="text-xs text-neutral-500">
                  Sekolah Menengah Atas (SMA)
                </div>
                <div className="text-2xl font-bold text-purple-600 mt-1">
                  {schoolCounts.SMA}
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                <div className="text-xs text-blue-600">Total Sekolah</div>
                <div className="text-3xl font-bold text-blue-700 mt-1">
                  {data.length}
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-sm text-neutral-500 animate-pulse">
              Memuat data...
            </div>
          )}

          {/* Routing Button */}
          <button
            onClick={() => setCurrentTab("routing")}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-700 hover:to-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-4"
          >
            <FaRoute className="w-4 h-4" />
            Open Route Planner
          </button>
        </div>
      )}
    </div>
  );
}
