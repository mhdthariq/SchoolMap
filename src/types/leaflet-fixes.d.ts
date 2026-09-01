import * as L from "leaflet";

declare global {
  // Fix for the 'L.Marker' error
  namespace L {
    interface MarkerOptions {
      icon?: Icon;
    }
  }
}

declare module "leaflet" {
  // Fix for 'no exported member Map'
  export interface Map {
    locate(options: any): void;
    on(eventName: string, handler: (...args: any[]) => void): void;
    off(eventName: string): void;
    setView(center: LatLng | [number, number], zoom: number): this;
    removeControl(control: Control): this;
  }

  // Fix for 'property addTo does not exist'
  namespace Routing {
    interface Control extends L.Control {
      addTo(map: L.Map): this;
      on(event: string, callback: (...args: any[]) => void): this;
    }
  }

  // Fix for 'iconRetinaUrl does not exist'
  interface IconOptions {
    iconRetinaUrl?: string;
    shadowRetinaUrl?: string;
    shadowSize?: L.Point | [number, number];
    shadowAnchor?: L.Point | [number, number];
  }

  // Fix for MapContainer defaultCenter property
  export function map(element: string | HTMLElement, options?: any): Map;
}

// Fix for react-leaflet issues
declare module "react-leaflet" {
  import { ReactNode } from "react";

  interface MapContainerProps {
    center?: [number, number];
    defaultCenter?: [number, number]; // Add this property
    zoom?: number;
    children?: ReactNode;
    style?: React.CSSProperties;
    className?: string;
    zoomControl?: boolean;
    scrollWheelZoom?: boolean;
    ref?: any;
  }

  interface TileLayerProps {
    url: string;
    attribution?: string;
    subdomains?: string | string[];
  }
}

// Add specific subdomains types for your MapLayers
declare module "@/components/map/LayerSwitcher" {
  export interface MapLayer {
    name: string;
    icon: any;
    url: string;
    attribution: string;
    subdomains?: string[] | string;
  }
}
