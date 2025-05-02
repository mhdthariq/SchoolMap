import { useEffect, useRef, useState } from "react";
import { Sekolah } from "@/types/school";
import L from "leaflet";
import RoutingSidebar from "./map/RoutingSidebar";
import { FaRoute, FaChartBar } from "react-icons/fa6";
import { RouteInfo } from "./map/RoutingControl";

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
  onFilterByEducationType: (type: string | null) => void; // 🔥 Tambahan
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
  onFilterByEducationType,
}: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [currentTab, setCurrentTab] = useState<"statistics" | "routing">(activeTab);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null); // 🔥 Tambahan

  useEffect(() => {
    if (activeTab) setCurrentTab(activeTab);
  }, [activeTab]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
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

  const handleFilterClick = (type: string | null) => {
    const newFilter = selectedFilter === type ? null : type;
    setSelectedFilter(newFilter);
    onFilterByEducationType(newFilter);
  };

  return (
    <div
      ref={sidebarRef}
      className={`
        fixed top-6 right-6 h-[90vh] w-[300px] z-[60]
        bg-white/90 backdrop-blur-md shadow-2xl border border-neutral-200 rounded-3xl
        transition-all duration-500 ease-in-out
        ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}
      `}
    >
      <div className="p-6 h-full flex flex-col justify-between">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                <span className="text-xl text-white">📍</span>
              </div>
              <div>
                <div className="text-base font-bold text-neutral-900">Peta Sekolah</div>
                <span className="text-[10px] text-white bg-gradient-to-r from-indigo-500 to-blue-600 px-2 py-0.5 rounded-full shadow-sm">
                  Web Pemetaan Sekolah
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentTab("statistics")}
              className={`flex-1 py-2 rounded-full text-sm font-medium flex items-center justify-center gap-1 transition ${
                currentTab === "statistics"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              <FaChartBar />
              Statistik
            </button>
            <button
              onClick={() => setCurrentTab("routing")}
              className={`flex-1 py-2 rounded-full text-sm font-medium flex items-center justify-center gap-1 transition ${
                currentTab === "routing"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              <FaRoute />
              Rute
            </button>
          </div>
        </div>

        {currentTab === "routing" ? (
          <div className="pt-6 flex-1 overflow-auto">
            <RoutingSidebar
              schools={data}
              userLocation={userLocation}
              onClose={() => setCurrentTab("statistics")}
              onCreateRoute={onCreateRoute}
              onClearRoute={onClearRoute}
              routeInfo={routeInfo}
            />
          </div>
        ) : (
          <div className="flex flex-col justify-between flex-1 mt-4">
            <div className="space-y-4">
              <div>
                <h2 className="text-xs font-medium text-neutral-500 uppercase">Wilayah</h2>
                <p className="text-blue-700 font-semibold text-lg mt-1">Kecamatan Medan Denai</p>
              </div>

              <div>
                <h2 className="text-sm font-medium text-neutral-600 mb-2">Statistik Sekolah 📊</h2>
                <div className="space-y-3">
                  {[
                    { key: "SD", title: "Sekolah Dasar (SD)", count: schoolCounts.SD, color: "text-blue-600", bg: "bg-blue-50" },
                    { key: "SMP", title: "Sekolah Menengah Pertama (SMP)", count: schoolCounts.SMP, color: "text-green-600", bg: "bg-green-50" },
                    { key: "SMA", title: "Sekolah Menengah Atas (SMA)", count: schoolCounts.SMA, color: "text-purple-600", bg: "bg-purple-50" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleFilterClick(item.key)}
                      className={`w-full text-left rounded-xl p-3 border ${item.bg} border-neutral-200 transition ${
                        selectedFilter === item.key ? "ring-2 ring-offset-1 ring-blue-500" : ""
                      }`}
                    >
                      <div className="text-xs text-neutral-500">{item.title}</div>
                      <div className={`text-2xl font-bold mt-1 ${item.color}`}>{item.count}</div>
                    </button>
                  ))}

                  <div className="pt-2" />
                  <div className="rounded-xl border bg-white shadow-inner border-blue-300 p-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-blue-600 font-semibold">Total Sekolah</div>
                      <div className="text-4xl font-black text-blue-700">{data.length}</div>
                    </div>
                  </div>
                </div>
              </div>

              {isLoading && (
                <div className="text-sm text-neutral-500 animate-pulse">Memuat data...</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
