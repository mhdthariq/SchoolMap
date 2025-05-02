import { useState, useEffect, useCallback } from "react";
import { useMap } from "react-leaflet";
import { FaDrawPolygon } from "react-icons/fa6";
import { MdToggleOn, MdToggleOff } from "react-icons/md";
import { GoGraph } from "react-icons/go";
import L from "leaflet";

interface PolygonControlProps {
  onToggle?: (active: boolean) => void;
}

export default function PolygonControl({ onToggle }: PolygonControlProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [polygonLayer, setPolygonLayer] = useState<L.GeoJSON | null>(null);
  const [useDistinctColors, setUseDistinctColors] = useState(false);
  const map = useMap();

  // Generate a color based on the district name for consistent colors
  const getColorForName = useCallback((name: string) => {
    // More distinct color options with better contrast
    const colorOptions = [
      "#FF5733", // Orange-red
      "#2ECC71", // Emerald green
      "#3498DB", // Bright blue
      "#9B59B6", // Purple
      "#F1C40F", // Yellow
      "#E67E22", // Orange
      "#16A085", // Green-teal
      "#8E44AD", // Deep purple
      "#E74C3C", // Bright red
      "#1ABC9C", // Turquoise
      "#D35400", // Pumpkin
      "#2980B9", // Ocean blue
      "#27AE60", // Nephritis green
      "#C0392B", // Pomegranate
      "#7D3C98", // Dark purple
    ];

    // Simple hash function to get a consistent index for the same name
    const hashCode = name.split("").reduce((hash, char) => {
      return char.charCodeAt(0) + ((hash << 5) - hash);
    }, 0);

    return colorOptions[Math.abs(hashCode) % colorOptions.length];
  }, []);

  // Function to load and display polygon data
  const loadPolygonData = useCallback(async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      // Remove existing polygon layer if exists
      if (polygonLayer) {
        map.removeLayer(polygonLayer);
        setPolygonLayer(null);
      }

      // Fetch kelurahan data from API
      const response = await fetch("/api/kelurahan");
      if (!response.ok) {
        throw new Error(`Failed to fetch kelurahan data: ${response.status}`);
      }

      const data = await response.json();

      // Create a new GeoJSON layer
      const layer = L.geoJSON(
        data.map((item: any) => ({
          type: "Feature",
          geometry: item.geometry,
          properties: {
            id: item.id,
            name: item.kelurahan,
            kecamatan: item.kecamatan,
          },
        })),
        {
          style: (feature) => {
            // Base style for all polygons
            const baseStyle = {
              color: "#333", // Border color
              weight: 2,
              opacity: 0.8,
              fillOpacity: 0.4,
            };

            // If distinct colors are enabled, use unique colors per district
            if (useDistinctColors && feature?.properties?.name) {
              return {
                ...baseStyle,
                fillColor: getColorForName(feature.properties.name),
              };
            }

            // Default uniform style - light blue
            return {
              ...baseStyle,
              fillColor: "#3388ff",
            };
          },
          onEachFeature: (feature, layer) => {
            if (feature.properties) {
              // Add a label on hover
              layer.bindTooltip(`${feature.properties.name}`, {
                permanent: false,
                direction: "center",
                className:
                  "bg-black/80 text-white border-0 rounded-md shadow-lg text-sm px-2 py-1",
              });

              // Make polygons interactive with click event
              layer.on("click", () => {
                layer.setStyle({
                  weight: 4,
                  opacity: 1,
                });
                setTimeout(() => {
                  layer.setStyle({
                    weight: 2,
                    opacity: 0.8,
                  });
                }, 1000);
              });
            }
          },
        }
      );

      // Add the layer to the map
      layer.addTo(map);
      setPolygonLayer(layer);
      setIsActive(true);

      if (onToggle) {
        onToggle(true);
      }
    } catch (error) {
      console.error("Error loading polygon data:", error);
      alert("Failed to load district boundaries");
    } finally {
      setIsLoading(false);
    }
  }, [
    isLoading,
    map,
    polygonLayer,
    onToggle,
    useDistinctColors,
    getColorForName,
  ]);

  // Function to remove polygon data
  const removePolygonData = useCallback(() => {
    if (polygonLayer) {
      map.removeLayer(polygonLayer);
      setPolygonLayer(null);
      setIsActive(false);

      if (onToggle) {
        onToggle(false);
      }
    }
  }, [map, polygonLayer, onToggle]);

  // Handle polygon toggle
  const handlePolygonToggle = useCallback(() => {
    if (isActive) {
      removePolygonData();
    } else {
      loadPolygonData();
    }
  }, [isActive, loadPolygonData, removePolygonData]);

  // Toggle distinct colors and reload polygons if active
  const toggleDistinctColors = useCallback(() => {
    // First update the state
    const newColorValue = !useDistinctColors;
    setUseDistinctColors(newColorValue);

    // If polygons are currently active, reload them with new color settings
    if (isActive) {
      setIsLoading(true);

      // Force removal of existing layer immediately
      if (polygonLayer) {
        map.removeLayer(polygonLayer);
      }

      // Create a new GeoJSON layer with updated style based on the new color setting
      fetch("/api/kelurahan")
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Failed to fetch kelurahan data: ${response.status}`
            );
          }
          return response.json();
        })
        .then((data) => {
          const layer = L.geoJSON(
            data.map((item: any) => ({
              type: "Feature",
              geometry: item.geometry,
              properties: {
                id: item.id,
                name: item.kelurahan,
                kecamatan: item.kecamatan,
              },
            })),
            {
              style: (feature) => {
                // Base style for all polygons
                const baseStyle = {
                  color: "#333", // Border color
                  weight: 2,
                  opacity: 0.8,
                  fillOpacity: 0.4,
                };

                // Use the new color value directly instead of the state
                if (newColorValue && feature?.properties?.name) {
                  return {
                    ...baseStyle,
                    fillColor: getColorForName(feature.properties.name),
                  };
                }

                // Default uniform style - light blue
                return {
                  ...baseStyle,
                  fillColor: "#3388ff",
                };
              },
              onEachFeature: (feature, layer) => {
                if (feature.properties) {
                  // Add a label on hover
                  layer.bindTooltip(`${feature.properties.name}`, {
                    permanent: false,
                    direction: "center",
                    className:
                      "bg-black/80 text-white border-0 rounded-md shadow-lg text-sm px-2 py-1",
                  });

                  // Make polygons interactive with click event
                  layer.on("click", () => {
                    layer.setStyle({
                      weight: 4,
                      opacity: 1,
                    });
                    setTimeout(() => {
                      layer.setStyle({
                        weight: 2,
                        opacity: 0.8,
                      });
                    }, 1000);
                  });
                }
              },
            }
          );

          // Add the layer to the map
          layer.addTo(map);
          setPolygonLayer(layer);
        })
        .catch((error) => {
          console.error("Error reloading polygon data:", error);
          alert("Failed to update district boundaries");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isActive, useDistinctColors, map, polygonLayer, getColorForName]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (polygonLayer) {
        map.removeLayer(polygonLayer);
      }
    };
  }, [map, polygonLayer]);

  return (
    <>
      {/* Button positioned ABOVE the location button (on right side) */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="absolute bottom-24 right-8 z-[1000] bg-white/90 backdrop-blur-md p-2.5 rounded-lg shadow-lg border border-neutral-200 
          transition-all duration-300 hover:bg-white hover:shadow-xl w-10 h-10 flex items-center justify-center"
        aria-label="Boundary controls"
      >
        <FaDrawPolygon
          className={`w-5 h-5 ${
            isActive ? "text-indigo-600" : "text-neutral-700"
          } transition-colors`}
        />
      </button>

      {/* Dropdown menu positioned above the button */}
      {showMenu && (
        <div
          className="absolute bottom-24 right-20 z-[1000] bg-white shadow-lg border 
          border-neutral-200 overflow-hidden min-w-[220px] animate-in fade-in slide-in-from-right-2 duration-200
          rounded-xl"
        >
          {/* Header bar */}
          <div className="bg-neutral-50 border-b border-neutral-200 px-3 py-2">
            <span className="text-sm font-medium text-neutral-700">
              Boundary Controls
            </span>
          </div>

          {/* Toggle options */}
          <div className="p-2 space-y-1">
            <button
              onClick={handlePolygonToggle}
              className="w-full px-3 py-2.5 flex items-center justify-between rounded-md hover:bg-neutral-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FaDrawPolygon
                  className={
                    isLoading
                      ? "animate-pulse text-blue-500"
                      : isActive
                      ? "text-indigo-600"
                      : "text-neutral-600"
                  }
                />
                <span className="text-sm font-medium text-neutral-800">
                  Show Kelurahan
                </span>
              </div>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-neutral-300 border-t-indigo-600 rounded-full animate-spin"></div>
              ) : isActive ? (
                <MdToggleOn className="w-7 h-7 text-indigo-600" />
              ) : (
                <MdToggleOff className="w-7 h-7 text-neutral-400" />
              )}
            </button>

            <button
              onClick={toggleDistinctColors}
              className={`w-full px-3 py-2.5 flex items-center justify-between rounded-md transition-colors ${
                isActive
                  ? "hover:bg-neutral-100"
                  : "opacity-50 cursor-not-allowed"
              }`}
              disabled={!isActive}
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-gradient-to-r from-pink-500 via-indigo-500 to-blue-500"></div>
                <span className="text-sm font-medium text-neutral-800">
                  Filter by Name
                </span>
              </div>
              {useDistinctColors ? (
                <MdToggleOn className="w-7 h-7 text-indigo-600" />
              ) : (
                <MdToggleOff className="w-7 h-7 text-neutral-400" />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
