import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import { Sekolah } from "@/types/school";

interface RoutingControlProps {
  userLocation: L.LatLng | null;
  schools: Sekolah[];
  origin?: "user" | string | null; // Changed from number to string
  destination?: string | null; // Changed from number to string
  onRouteInfoUpdate?: (routeInfo: RouteInfo | null) => void;
}

export interface RouteInfo {
  distance: number;
  duration: number;
  instructions: {
    text: string;
    distance: number;
    type: string;
  }[];
  summary: string;
}

export default function RoutingControl({
  userLocation,
  schools,
  origin,
  destination,
  onRouteInfoUpdate,
}: RoutingControlProps) {
  // @ts-ignore - Ignore TypeScript errors for Routing.Control
  const [routingControl, setRoutingControl] =
    useState<L.Routing.Control | null>(null);
  const map = useMap();

  // Clear existing routing when component unmounts
  useEffect(() => {
    return () => {
      if (routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, routingControl]);

  // Create or update route when origin or destination changes
  useEffect(() => {
    // Remove existing routing control if it exists
    if (routingControl) {
      map.removeControl(routingControl);
      setRoutingControl(null);
      if (onRouteInfoUpdate) {
        onRouteInfoUpdate(null);
      }
    }

    if (!origin || !destination) {
      return;
    }

    let originPoint: L.LatLng;
    if (origin === "user") {
      if (!userLocation) {
        console.error("User location is not available");
        return;
      }
      originPoint = userLocation;
    } else {
      const originSchool = schools.find((s) => s.uuid === origin);
      if (!originSchool) return;
      originPoint = L.latLng(originSchool.lat, originSchool.lng);
    }

    const destinationSchool = schools.find((s) => s.uuid === destination);
    if (!destinationSchool) return;
    const destinationPoint = L.latLng(
      destinationSchool.lat,
      destinationSchool.lng
    );

    try {
      // Create routing control with hidden container
      // @ts-ignore - Ignore TypeScript errors for Routing.control
      const control = L.Routing.control({
        waypoints: [originPoint, destinationPoint],
        routeWhileDragging: false,
        showAlternatives: true,
        fitSelectedRoutes: true,
        lineOptions: {
          styles: [{ color: "#4f46e5", opacity: 0.8, weight: 6 }],
        },
        altLineOptions: {
          styles: [{ color: "#818cf8", opacity: 0.6, weight: 4 }],
        },
        createMarker: () => null, // Don't create additional markers
        show: false, // Hide the default routing container
        collapsible: true, // Make sure this is collapsible
      });

      // @ts-ignore - Ignore TypeScript errors for control.addTo
      control.addTo(map);

      // Extract route information when route is calculated
      // @ts-ignore - Ignore TypeScript errors for routesfound event
      control.on("routesfound", (e: any) => {
        if (e.routes && e.routes.length > 0 && onRouteInfoUpdate) {
          const route = e.routes[0];
          const instructions = route.instructions.map((instr: any) => ({
            text: instr.text,
            distance: instr.distance,
            type: instr.type,
          }));

          onRouteInfoUpdate({
            distance: route.summary.totalDistance,
            duration: route.summary.totalTime,
            instructions: instructions,
            summary: `${(route.summary.totalDistance / 1000).toFixed(
              1
            )} km, ${Math.round(route.summary.totalTime / 60)} min`,
          });
        }
      });

      setRoutingControl(control);
    } catch (error) {
      console.error("Error creating routing control:", error);
    }
  }, [map, origin, destination, userLocation, schools, onRouteInfoUpdate]);

  return (
    <>
      {/* Hide the default Leaflet Routing Machine container */}
      <style jsx global>{`
        .leaflet-routing-container {
          display: none !important;
        }
      `}</style>
    </>
  );
}
