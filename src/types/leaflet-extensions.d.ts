import * as L from "leaflet";

declare module "leaflet" {
  // Add GeoJSON type
  export interface GeoJSON extends L.Layer {
    addData(data: any): this;
    addTo(map: L.Map): this; // Add the missing addTo method
  }

  // Add geoJSON factory function
  export function geoJSON(geojson?: any, options?: GeoJSONOptions): GeoJSON;

  // Add GeoJSONOptions interface
  export interface GeoJSONOptions {
    style?: (feature: any) => any;
    onEachFeature?: (feature: any, layer: L.Layer) => void;
    filter?: (feature: any, layer: L.Layer) => boolean;
    pointToLayer?: (feature: any, latlng: L.LatLng) => L.Layer;
    coordsToLatLng?: (
      coords: [number, number] | [number, number, number]
    ) => L.LatLng;
  }

  // Ensure Map has removeLayer method
  export interface Map {
    removeLayer(layer: Layer): this;
  }
}

// Add spellcheck exceptions for domain-specific words
interface SpellcheckableWords {
  kelurahan: string;
  kecamatan: string;
  provinsi: string;
  geometri: string;
  luas: string;
  kode: string;
}
