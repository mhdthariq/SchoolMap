import * as L from "leaflet";

declare module "leaflet" {
  // Add missing interfaces
  interface LatLng {
    lat: number;
    lng: number;
  }

  interface LocationEvent extends L.LeafletEvent {
    latlng: L.LatLng;
    bounds: L.LatLngBounds;
    accuracy: number;
    altitude?: number;
    altitudeAccuracy?: number;
    heading?: number;
    speed?: number;
    timestamp?: number;
  }

  interface ErrorEvent extends L.LeafletEvent {
    message: string;
    code: number;
  }

  // Add missing methods
  export function latLng(lat: number, lng: number): LatLng;
  export function latLng(coords: [number, number]): LatLng;
  export function latLng(coords: { lat: number; lng: number }): LatLng;

  // Add support for icon properties
  interface IconOptions {
    iconUrl: string;
    iconRetinaUrl?: string;
    iconSize?: L.Point | number[];
    iconAnchor?: L.Point | number[];
    popupAnchor?: L.Point | number[];
    shadowUrl?: string;
    shadowRetinaUrl?: string;
    shadowSize?: L.Point | number[];
    shadowAnchor?: L.Point | number[];
    className?: string;
  }

  // Add Routing namespace
  namespace Routing {
    interface RoutingControlOptions {
      waypoints: L.LatLng[];
      router?: any;
      routeWhileDragging?: boolean;
      showAlternatives?: boolean;
      fitSelectedRoutes?: boolean;
      lineOptions?: any;
      altLineOptions?: any;
      show?: boolean;
      collapsible?: boolean;
      createMarker?: (
        i: number,
        waypoint: L.LatLng,
        n: number
      ) => L.Marker | null;
    }

    class Control extends L.Control {
      constructor(options: RoutingControlOptions);
      getPlan(): any;
      getRouter(): any;
      route(): void;
      on(event: string, fn: (...args: any[]) => void): this;
      off(event: string): this;
    }

    // Add static method
    function control(options: RoutingControlOptions): Control;
  }
}

// Add missing types for react-leaflet components
declare module "react-leaflet" {
  import * as L from "leaflet";
  import { ReactNode } from "react";

  interface MapContainerProps {
    center?: [number, number];
    zoom?: number;
    scrollWheelZoom?: boolean;
    zoomControl?: boolean;
    style?: React.CSSProperties;
    className?: string;
    children?: ReactNode;
  }

  interface TileLayerProps {
    url: string;
    attribution?: string;
    subdomains?: string | string[];
    [key: string]: any;
  }

  interface MarkerProps {
    position: [number, number] | L.LatLng;
    icon?: L.Icon;
    eventHandlers?: {
      [eventName: string]: (...args: any[]) => void;
    };
    children?: ReactNode;
  }
}

// Ensure spellcheck doesn't complain about Leaflet/domain-specific terms
interface SpellcheckableWords {
  Sekolah: string;
  sekolah: string;
  npsn: string;
  alamat: string;
  bentuk: string;
  pendidikan: string;
  akreditasi: string;
  jumlah: string;
  murid: string;
  guru: string;
  latlng: string;
  Denai: string;
  leaflet: string;
  locationfound: string;
  locationerror: string;
  popupclose: string;
  routesfound: string;
  geometri: string;
}
