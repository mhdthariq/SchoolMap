# TypeScript Types Guide

This document explains the TypeScript types used in the School Map App and how they enhance code reliability and developer experience.

## Core Types

The application uses TypeScript to ensure type safety throughout the codebase. Here are the key types defined in the project:

### School Type

Located in `src/types/school.ts`, this interface defines the structure of school data:

```typescript
export interface Sekolah {
  uuid: string;
  npsn: string;
  nama: string;
  alamat: string;
  kelurahan_id: number;
  bentuk_pendidikan: "SD" | "SMP" | "SMA";
  status: "Negeri" | "Swasta";
  akreditasi?: string;
  jumlah_siswa?: number;
  jumlah_guru?: number;
  lat: number;
  lng: number;
}
```

This type is used throughout the application to ensure consistency in how school data is handled.

### Leaflet Extensions

The app extends Leaflet with custom functionality, properly typed in several definition files:

#### `src/types/leaflet-extensions.d.ts`

This file adds type definitions for custom events and properties added to Leaflet:

```typescript
declare namespace L {
  interface MapOptions {
    // Additional custom options
    preferCanvas?: boolean;
    tap?: boolean;
    fadeAnimation?: boolean;
    markerZoomAnimation?: boolean;
  }

  interface Map {
    // Additional custom methods and events
    on(type: "findMyLocation", fn: () => void): this;
    on(
      type: "useSessionLocation",
      fn: (event: { detail: LatLngLiteral }) => void
    ): this;
  }
}
```

#### `src/types/leaflet-routing-machine.d.ts`

This file provides type definitions for the Leaflet Routing Machine plugin:

```typescript
declare namespace L {
  namespace Routing {
    interface RoutingControlOptions {
      waypoints: LatLng[];
      router: IRouter;
      plan?: Plan;
      showAlternatives?: boolean;
      routeWhileDragging?: boolean;
      lineOptions?: LineOptions;
      show?: boolean;
      collapsible?: boolean;
    }

    interface Waypoint {
      latLng: LatLng;
      name?: string;
    }

    interface Route {
      name: string;
      coordinates: LatLng[];
      summary: {
        totalDistance: number;
        totalTime: number;
      };
      instructions: Instruction[];
    }

    interface Instruction {
      type: string;
      distance: number;
      time: number;
      road?: string;
      direction?: string;
      text: string;
      index: number;
    }

    interface RouteSummary {
      totalDistance: number;
      totalTime: number;
    }

    interface LineOptions {
      styles?: object[];
      addWaypoints?: boolean;
      missingRouteTolerance?: number;
    }

    interface PlanOptions {
      addWaypoints?: boolean;
      draggableWaypoints?: boolean;
      dragStyles?: object[];
      maxGeocoderTolerance?: number;
      geocoder?: object;
      routeWhileDragging?: boolean;
      createGeocoderElement?: boolean;
    }

    interface IRouter {
      route(
        waypoints: Waypoint[],
        callback: (error: any, routes: Route[]) => void
      ): void;
    }

    class Control extends L.Control {
      constructor(options: RoutingControlOptions);
      getRouter(): IRouter;
      getWaypoints(): Waypoint[];
      setWaypoints(waypoints: LatLng[]): this;
      getPlan(): Plan;
      getRouteSummary(): RouteSummary;
      getRoutes(): Route[];
      hide(): void;
      show(): void;
    }

    class Plan {
      constructor(waypoints: LatLng[], options: PlanOptions);
    }

    class OSRMv1 implements IRouter {
      constructor(options?: object);
    }
  }
}
```

## Context Types

The application uses React Context for state management, with properly typed contexts:

### Location Context Type

Located in `src/contexts/LocationContext.tsx`:

```typescript
interface LocationContextType {
  userLocation: L.LatLng | null;
  setUserLocation: (location: L.LatLng | null) => void;
  lastKnownPosition: L.LatLng | null;
  setLastKnownPosition: (location: L.LatLng | null) => void;
}

export const LocationContext = createContext<LocationContextType>({
  userLocation: null,
  setUserLocation: () => {},
  lastKnownPosition: null,
  setLastKnownPosition: () => {},
});
```

## Component Props Types

Each component has properly defined props types:

### Map Component Props

```typescript
interface MapProps {
  data: Sekolah[];
  onMapReady: (map: L.Map) => void;
  onUserLocationUpdate?: (location: L.LatLng) => void;
  routeOrigin?: "user" | string | null;
  routeDestination?: string | null;
  onRouteInfoUpdate?: (info: RouteInfo | null) => void;
  schoolTypeFilter?: string | null;
  mapLayer?: MapLayerKey;
}
```

### Sidebar Component Props

```typescript
interface SidebarProps {
  isOpen: boolean;
  onClose: (event: MouseEvent) => void;
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
  onSchoolTypeFilter: (type: string | null) => void;
  activeFilter: string | null;
  onTabChange: (tab: "statistics" | "routing") => void;
}
```

## Utility Types

The application uses various utility types to enhance code readability and safety:

### Route Information Type

```typescript
export interface RouteInfo {
  distance: number; // in meters
  duration: number; // in seconds
  instructions: RoutingInstruction[];
}

interface RoutingInstruction {
  text: string;
  distance: number;
  time: number;
  type: string;
}
```

### Map Layer Type

```typescript
export type MapLayerKey = keyof typeof MAP_LAYERS;

const MAP_LAYERS = {
  osm: {
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    icon: FaMapMarked,
  },
  // Other map layer definitions...
};
```

## How to Add New Types

When adding new functionality, follow these steps to maintain type safety:

1. **Define interfaces** for new data structures
2. **Extend existing types** when adding properties to existing concepts
3. **Use type guards** when narrowing types

Example of adding a new type:

```typescript
// Define a new interface
interface SchoolStatistics {
  totalSchools: number;
  byType: {
    SD: number;
    SMP: number;
    SMA: number;
  };
  byStatus: {
    Negeri: number;
    Swasta: number;
  };
}

// Use the type in a component
function StatisticsDisplay({ stats }: { stats: SchoolStatistics }) {
  return (
    <div>
      <h2>School Statistics</h2>
      <p>Total Schools: {stats.totalSchools}</p>
      <h3>By Type</h3>
      <ul>
        <li>SD: {stats.byType.SD}</li>
        <li>SMP: {stats.byType.SMP}</li>
        <li>SMA: {stats.byType.SMA}</li>
      </ul>
    </div>
  );
}
```

## Benefits of TypeScript in This Project

1. **Autocompletion**: Developers get intelligent suggestions in the IDE
2. **Error prevention**: Many errors are caught at compile time instead of runtime
3. **Self-documentation**: Types serve as documentation for how data should be structured
4. **Refactoring support**: Changes to data structures highlight all affected code
5. **Better integration** with Leaflet and other libraries through proper type definitions

## Type Checking

The project uses strict type checking configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

This ensures maximum type safety throughout the codebase.
