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
import { IoClose } from "react-icons/io5";
import L from "leaflet";
import { RouteInfo } from "./RoutingControl";
import RouteInformationPanel from "./RouteInformationPanel";

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
  const [selectedOrigin, setSelectedOrigin] = useState<"user" | string | null>(
    null
  );
  const [selectedDestination, setSelectedDestination] = useState<string | null>(
    null
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Add this useEffect to update the origin when userLocation changes
  useEffect(() => {
    if (userLocation && !selectedOrigin) {
      setSelectedOrigin("user");
    }
  }, [userLocation, selectedOrigin]);
  const [hasSessionLocation, setHasSessionLocation] = useState(false);

  // Check for session location
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("school_map_locations");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.userLocation) {
          setHasSessionLocation(true);
        }
      }
    } catch (error) {
      console.error("Error checking session location:", error);
    }
  }, []);

  // Function to refresh location data
  const handleRefreshLocation = () => {
    setIsRefreshing(true);

    // Dispatch a custom event to trigger location finding in LocationControl
    const mapElement = document.querySelector(".leaflet-container");
    if (mapElement) {
      const event = new CustomEvent("findMyLocation");
      mapElement.dispatchEvent(event);

      // Set a timeout to check if location was found
      const checkLocationInterval = setInterval(() => {
        if (userLocation) {
          // Location found, clear interval and set as origin
          clearInterval(checkLocationInterval);
          setSelectedOrigin("user");
          setIsRefreshing(false);
        }
      }, 1000);

      // Set a timeout to stop checking after 10 seconds
      setTimeout(() => {
        clearInterval(checkLocationInterval);
        setIsRefreshing(false);
      }, 10000);
    }
  };

  const handleCreateRoute = () => {
    if (!selectedOrigin || !selectedDestination) {
      alert("Please select both origin and destination");
      return;
    }

    // Check if user location is selected but not available
    if (selectedOrigin === "user" && !userLocation) {
      alert(
        "Your current location is not available. Please enable location services or choose a different starting point."
      );
      return;
    }

    onCreateRoute(selectedOrigin, selectedDestination);
  };

  const handleClearRoute = () => {
    setSelectedOrigin(null);
    setSelectedDestination(null);
    onClearRoute();
  };

  // Get school names for display
  const getOriginName = () => {
    if (selectedOrigin === "user") return "My Current Location";
    if (selectedOrigin) {
      const school = schools.find((s) => s.uuid === selectedOrigin);
      return school ? school.nama : "";
    }
    return "";
  };

  const getDestinationName = () => {
    if (selectedDestination) {
      const school = schools.find((s) => s.uuid === selectedDestination);
      return school ? school.nama : "";
    }
    return "";
  };

  // Get icon for instruction type
  const getInstructionIcon = (type: string) => {
    switch (type) {
      case "Right":
        return <FaArrowRight className="text-indigo-500" />;
      case "Left":
        return <FaArrowLeft className="text-indigo-500" />;
      case "Straight":
        return <FaArrowUp className="text-indigo-500" />;
      case "SharpRight":
        return <FaArrowRight className="text-indigo-600" />;
      case "SharpLeft":
        return <FaArrowLeft className="text-indigo-600" />;
      case "SlightRight":
        return <FaArrowRight className="text-indigo-400" />;
      case "SlightLeft":
        return <FaArrowLeft className="text-indigo-400" />;
      case "WaypointReached":
        return <FaLocationDot className="text-green-500" />;
      case "Roundabout":
        return <FaArrowRight className="text-indigo-500 rotate-45" />;
      case "DestinationReached":
        return <FaSchool className="text-green-600" />;
      default:
        return <FaArrowUp className="text-indigo-500" />;
    }
  };

  // Function to find current location
  const handleFindMyLocation = () => {
    if (!userLocation) {
      // If no location available, try to get current location
      const mapElement = document.querySelector(".leaflet-container");
      if (mapElement) {
        const event = new CustomEvent("findMyLocation");
        mapElement.dispatchEvent(event);
      }
    } else {
      // If location is already available, just set it as origin
      setSelectedOrigin("user");
    }
  };

  // Function to use session location
  const handleUseSessionLocation = () => {
    try {
      const savedData = localStorage.getItem("school_map_locations");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.userLocation) {
          const mapElement = document.querySelector(".leaflet-container");
          if (mapElement) {
            const event = new CustomEvent("useSessionLocation", {
              detail: parsed.userLocation,
            });
            mapElement.dispatchEvent(event);
            // Set the origin to 'user' after dispatching the event
            setSelectedOrigin("user");
          }
        }
      }
    } catch (error) {
      console.error("Error loading saved location:", error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 text-white">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <FaRoute className="w-4 h-4" />
            Route Planner
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close panel"
          >
            <IoClose className="w-5 h-5 text-white" />
          </button>
        </div>
        <p className="text-white/80 text-xs mt-1">
          Find the best route to your destination
        </p>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {/* Origin Selection */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-1.5">
            <FaLocationDot className="text-indigo-500 w-3.5 h-3.5" />
            Starting Point
          </label>
          <select
            className="w-full p-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-neutral-800 text-sm"
            value={
              selectedOrigin === null
                ? ""
                : selectedOrigin === "user"
                ? "user"
                : selectedOrigin
            }
            onChange={(e) => {
              const value = e.target.value;
              if (value === "user") {
                setSelectedOrigin("user");
              } else if (value === "refresh") {
                handleRefreshLocation();
              } else if (value) {
                setSelectedOrigin(value);
              } else {
                setSelectedOrigin(null);
              }
            }}
          >
            <option value="">Choose starting point...</option>
            {userLocation && (
              <option value="user" className="font-medium">
                📍 My Current Location
              </option>
            )}
            {!userLocation && (
              <option value="refresh" className="font-medium">
                🔄{" "}
                {isRefreshing
                  ? "Finding your location..."
                  : "Refresh location data"}
              </option>
            )}
            <optgroup label="Schools">
              {schools.map((school) => (
                <option key={`origin-${school.uuid}`} value={school.uuid}>
                  {school.nama}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Destination Selection */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-1.5">
            <FaSchool className="text-indigo-500 w-3.5 h-3.5" />
            Destination
          </label>
          <select
            className="w-full p-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-neutral-800 text-sm"
            value={selectedDestination === null ? "" : selectedDestination}
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                setSelectedDestination(value);
              } else {
                setSelectedDestination(null);
              }
            }}
          >
            <option value="">Choose destination...</option>
            {schools.map((school) => (
              <option key={`dest-${school.uuid}`} value={school.uuid}>
                {school.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleCreateRoute}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-700 hover:to-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
            disabled={
              !selectedOrigin ||
              !selectedDestination ||
              (selectedOrigin === "user" && !userLocation)
            }
          >
            <FaRoute className="w-3.5 h-3.5" />
            Get Directions
          </button>
          <button
            onClick={handleClearRoute}
            className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium py-2 px-3 rounded-lg 
              transition-colors border border-neutral-300 text-sm"
          >
            Clear
          </button>
        </div>

        {/* Route Results */}
        {routeInfo ? (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <div className="bg-indigo-600 rounded-lg p-3 text-white">
              <h4 className="text-sm font-medium mb-2">Route Information</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <FaRoute className="w-4 h-4 text-indigo-200" />
                  <span className="text-sm">
                    {(routeInfo.distance / 1000).toFixed(1)} km
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-indigo-200"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span className="text-sm">
                    {Math.round(routeInfo.duration / 60)} min
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <div className="p-3 bg-indigo-50 border-b border-indigo-100">
                <div className="text-xs text-indigo-700 font-medium">
                  <div className="flex items-center gap-1.5">
                    <FaLocationDot className="text-indigo-500 w-3 h-3" />
                    <span className="truncate">{getOriginName()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <FaSchool className="text-indigo-500 w-3 h-3" />
                    <span className="truncate">{getDestinationName()}</span>
                  </div>
                </div>
              </div>

              {/* Route Instructions */}
              <div className="max-h-[300px] overflow-y-auto">
                {routeInfo.instructions.map((instruction, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-xs p-3 border-b border-neutral-100"
                  >
                    <div className="p-1.5 bg-indigo-50 rounded-md">
                      {getInstructionIcon(instruction.type)}
                    </div>
                    <div className="flex-1">
                      <div className="text-neutral-800">{instruction.text}</div>
                      {instruction.distance > 0 && (
                        <div className="text-neutral-500 text-[10px] mt-0.5">
                          {instruction.distance < 1000
                            ? `${instruction.distance.toFixed(0)} m`
                            : `${(instruction.distance / 1000).toFixed(1)} km`}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <h4 className="text-sm font-medium text-neutral-700 mb-2">
              Route Information
            </h4>
            <div className="text-xs text-neutral-500 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
              Select origin and destination to see route details
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
