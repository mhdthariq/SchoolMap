import { useState, useEffect } from "react";
import { Sekolah } from "@/types/school";
import {
  FaRoute,
  FaLocationDot,
  FaSchool,
  FaArrowRight,
  FaArrowLeft,
  FaArrowUp,
} from "react-icons/fa6";
import L from "leaflet";
import { RouteInfo } from "./RoutingControl";

interface RoutingSidebarProps {
  schools: Sekolah[];
  userLocation: L.LatLng | null;
  onClose: () => void;
  onCreateRoute: (
    origin: "user" | string | null,
    destination: string | null
  ) => void;
  onClearRoute: () => void;
  routeInfo?: RouteInfo | null;
}

export default function RoutingSidebar({
  schools,
  userLocation,
  onClose,
  onCreateRoute,
  onClearRoute,
  routeInfo,
}: RoutingSidebarProps) {
  const [selectedOrigin, setSelectedOrigin] = useState<"user" | string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);

  useEffect(() => {
    if (userLocation && !selectedOrigin) {
      setSelectedOrigin("user");
    }
  }, [userLocation, selectedOrigin]);

  const handleCreateRoute = () => {
    if (!selectedOrigin || !selectedDestination) {
      alert("Please select both origin and destination");
      return;
    }
    if (selectedOrigin === "user" && !userLocation) {
      alert("Location not available. Enable GPS or choose a starting point.");
      return;
    }
    onCreateRoute(selectedOrigin, selectedDestination);
  };

  const handleClearRoute = () => {
    setSelectedOrigin(null);
    setSelectedDestination(null);
    onClearRoute();
  };

  const getOriginName = () => {
    if (selectedOrigin === "user") return "My Current Location";
    const school = schools.find((s) => s.uuid === selectedOrigin);
    return school ? school.nama : "";
  };

  const getDestinationName = () => {
    const school = schools.find((s) => s.uuid === selectedDestination);
    return school ? school.nama : "";
  };

  const getInstructionIcon = (type: string) => {
    switch (type) {
      case "Right": return <FaArrowRight className="text-indigo-500" />;
      case "Left": return <FaArrowLeft className="text-indigo-500" />;
      case "Straight": return <FaArrowUp className="text-indigo-500" />;
      default: return <FaArrowUp className="text-indigo-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-5 text-white rounded-t-3xl">
        <h3 className="font-bold text-xl flex items-center gap-2">
          <FaRoute className="w-5 h-5" />
          Route Planner
        </h3>
        <p className="text-sm mt-1 text-white">
          Find the best route to your destination
        </p>
      </div>

      {/* Content with scroll */}
      <div className="p-5 space-y-4 flex-1 overflow-y-auto">
        {/* Origin */}
        <div>
          <label className="text-sm font-semibold text-black flex items-center gap-2 mb-1">
            <FaLocationDot className="text-indigo-500" /> Starting Point
          </label>
          <select
            className="w-full border border-neutral-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white text-black"
            value={selectedOrigin ?? ""}
            onChange={(e) => setSelectedOrigin(e.target.value || null)}
          >
            <option className="text-black" value="">Choose starting point...</option>
            {userLocation && (
              <option className="text-black" value="user">📍 My Current Location</option>
            )}
            {schools.map((s) => (
              <option className="text-black" key={s.uuid} value={s.uuid}>
                {s.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Destination */}
        <div>
          <label className="text-sm font-semibold text-black flex items-center gap-2 mb-1">
            <FaSchool className="text-indigo-500" /> Destination
          </label>
          <select
            className="w-full border border-neutral-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white text-black"
            value={selectedDestination ?? ""}
            onChange={(e) => setSelectedDestination(e.target.value || null)}
          >
            <option className="text-black" value="">Choose destination...</option>
            {schools.map((s) => (
              <option className="text-black" key={s.uuid} value={s.uuid}>
                {s.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCreateRoute}
            disabled={!selectedOrigin || !selectedDestination}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm flex items-center justify-center gap-2 shadow-sm"
          >
            <FaRoute className="w-4 h-4" />
            Get Directions
          </button>
          <button
            onClick={handleClearRoute}
            className="bg-neutral-200 hover:bg-neutral-300 text-black font-medium text-sm px-4 py-2 rounded-lg border border-neutral-300"
          >
            Clear
          </button>
        </div>

        {/* Route Info */}
        <div>
          <h4 className="text-sm font-semibold text-black mb-2">Route Information</h4>
          {routeInfo ? (
            <div className="space-y-3">
              <div className="bg-white border border-indigo-200 rounded-lg p-3 shadow-sm">
                <div className="text-sm font-medium text-indigo-700 mb-1">Summary</div>
                <div className="text-sm text-black">
                  Distance: {(routeInfo.distance / 1000).toFixed(1)} km<br />
                  Duration: {Math.round(routeInfo.duration / 60)} min
                </div>
              </div>

              <div className="bg-white rounded-lg border border-neutral-200">
                <div className="p-3 bg-indigo-50 border-b border-indigo-100 text-sm text-indigo-700 font-medium">
                  <div className="flex items-center gap-1">
                    <FaLocationDot /> {getOriginName()}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <FaSchool /> {getDestinationName()}
                  </div>
                </div>

                <div className="divide-y max-h-[250px] overflow-y-auto">
                  {routeInfo.instructions.map((instr, idx) => (
                    <div key={idx} className="flex items-start gap-2 px-3 py-2 text-sm">
                      <div className="bg-indigo-100 p-1.5 rounded">
                        {getInstructionIcon(instr.type)}
                      </div>
                      <div>
                        <div className="text-black">{instr.text}</div>
                        <div className="text-xs text-neutral-700">
                          {instr.distance < 1000
                            ? `${instr.distance.toFixed(0)} m`
                            : `${(instr.distance / 1000).toFixed(1)} km`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-black bg-neutral-50 border border-neutral-200 rounded-lg p-4">
              Select origin and destination to view directions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
