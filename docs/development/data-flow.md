# Data Flow

This document explains how data flows through the School Map App, from the database to the user interface.

## Overview

The School Map App follows a clear data flow pattern:

1. **Data Source**: PostgreSQL database with geographic data
2. **API Layer**: Next.js API routes that fetch and process data
3. **State Management**: React state hooks and context for managing application state
4. **Components**: React components that consume and display the data
5. **User Interaction**: User inputs that trigger state changes and data updates

## Data Flow Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  PostgreSQL │     │  Next.js    │     │   React     │     │   User      │
│  Database   │◄───►│  API Routes │◄───►│   Components│◄───►│  Interface  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       ▲                   ▲                   ▲                   ▲
       │                   │                   │                   │
       └───────────────────┴───────────────────┴───────────────────┘
                     Data flows bidirectionally
```

## Detailed Flow Process

### 1. Database to API

```typescript
// src/lib/data.ts
export async function getSchools() {
  try {
    const result = await db.query(`
      SELECT 
        uuid,
        npsn,
        nama,
        alamat,
        bentuk_pendidikan,
        status,
        akreditasi,
        jumlah_siswa,
        jumlah_guru,
        kelurahan_id,
        lat,
        lng
      FROM 
        sekolah
      ORDER BY 
        nama
    `);
    return result.rows;
  } catch (error) {
    console.error("Database error in getSchools:", error);
    throw error;
  }
}
```

```typescript
// src/app/api/sekolah/route.ts
import { getSchools } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const schools = await getSchools();
    return NextResponse.json(schools);
  } catch (error) {
    console.error("Error fetching schools:", error);
    return NextResponse.json(
      { error: "Failed to fetch schools" },
      { status: 500 }
    );
  }
}
```

### 2. API to Component State

```typescript
// src/app/page.tsx
useEffect(() => {
  fetch("/api/sekolah")
    .then((res) => res.json())
    .then((data) => {
      setSekolahData(data);
      setIsLoading(false);
    })
    .catch((err) => {
      console.error("Error loading sekolah:", err);
      setIsLoading(false);
    });
}, []);
```

### 3. Component State to UI

```tsx
// Passing data to the Map component
<Map
  data={sekolahData}
  onMapReady={handleMapReady}
  onUserLocationUpdate={handleUserLocationUpdate}
  routeOrigin={routeOrigin}
  routeDestination={routeDestination}
  onRouteInfoUpdate={handleRouteInfoUpdate}
  schoolTypeFilter={schoolTypeFilter}
  mapLayer={mapLayer}
/>
```

```tsx
// Rendering data in the Map component
{
  data.filter(shouldShowSchool).map((sekolah) => (
    <Marker
      key={sekolah.uuid}
      position={[sekolah.lat, sekolah.lng]}
      icon={getSchoolIcon(sekolah)}
      eventHandlers={{
        click: () => {
          setSelectedSchool(sekolah);
        },
        popupclose: () => {
          setSelectedSchool(null);
        },
      }}
    >
      <SchoolPopup school={sekolah} />
    </Marker>
  ));
}
```

### 4. User Interaction to State Change

```tsx
// When a user selects a school type filter
<button
  onClick={() => onSchoolTypeFilter("SD")}
  className={`text-left w-full ${
    activeFilter === "SD"
      ? "ring-2 ring-blue-400 bg-blue-50"
      : "bg-neutral-50 hover:bg-blue-50/50"
  } rounded-lg p-3 border border-neutral-200 transition-all duration-200`}
  data-nav-button="true"
>
  <div className="text-xs text-neutral-500">Sekolah Dasar (SD)</div>
  <div className="text-2xl font-bold text-blue-600 mt-1">{schoolCounts.SD}</div>
</button>
```

```typescript
// The filter handler in the parent component
const handleSchoolTypeFilter = (type: string | null) => {
  setSchoolTypeFilter(type);
};
```

## Context-Based Data Flow

Some data, like user location, is shared across multiple components using React Context:

```typescript
// src/contexts/LocationContext.tsx
export const LocationContext = createContext<LocationContextType>({
  userLocation: null,
  setUserLocation: () => {},
  lastKnownPosition: null,
  setLastKnownPosition: () => {},
});

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [userLocation, setUserLocation] = useState<L.LatLng | null>(null);
  const [lastKnownPosition, setLastKnownPosition] = useState<L.LatLng | null>(
    null
  );

  // Load saved location on mount
  useEffect(() => {
    const savedLocation = getSavedLocation();
    if (savedLocation) {
      setLastKnownPosition(savedLocation);
    }
  }, []);

  // Save location when it changes
  useEffect(() => {
    if (userLocation) {
      saveUserLocation(userLocation);
      setLastKnownPosition(userLocation);
    }
  }, [userLocation]);

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        setUserLocation,
        lastKnownPosition,
        setLastKnownPosition,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}
```

Using the context in components:

```typescript
// In a component that needs location data
import { useLocation } from "@/contexts/LocationContext";

function MyComponent() {
  const { userLocation, setUserLocation } = useLocation();

  // Use location data...
}
```

## Lazy Loading and Dynamic Imports

For better performance, some components are loaded dynamically:

```typescript
// src/app/page.tsx
const Map = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-pulse text-center">
        <div className="text-xl text-white">Loading map...</div>
        <div className="text-sm text-neutral-400">
          Please wait while we initialize the map
        </div>
      </div>
    </div>
  ),
});

const MobileControls = dynamic(
  () => import("@/components/mobile/MobileControls"),
  {
    ssr: false,
  }
);
```

This ensures that:

1. Heavy map components only load in the client
2. The initial page load is faster
3. A loading state is shown while components are loading

## Data Transformation

Sometimes data needs to be transformed between the API and components:

```typescript
// Transforming raw data into a filtered subset
const filteredSchools = schools.filter(
  (school) => school.bentuk_pendidikan === activeFilter
);

// Transforming raw data into statistics
const schoolCounts = {
  SD: data.filter((s) => s.bentuk_pendidikan === "SD").length,
  SMP: data.filter((s) => s.bentuk_pendidikan === "SMP").length,
  SMA: data.filter((s) => s.bentuk_pendidikan === "SMA").length,
};
```

## Error Handling

Error handling is implemented at multiple levels:

1. **API Level**: Catch and return appropriate error responses
2. **Fetch Level**: Handle network errors when fetching data
3. **Component Level**: Display user-friendly error states

```typescript
// Error handling in API
try {
  const schools = await getSchools();
  return NextResponse.json(schools);
} catch (error) {
  console.error("Error fetching schools:", error);
  return NextResponse.json(
    { error: "Failed to fetch schools" },
    { status: 500 }
  );
}

// Error handling in fetch
fetch("/api/sekolah")
  .then((res) => res.json())
  .then((data) => {
    setSekolahData(data);
    setIsLoading(false);
  })
  .catch((err) => {
    console.error("Error loading sekolah:", err);
    setIsLoading(false);
    setError("Failed to load school data. Please try again later.");
  });

// Error display in component
{
  error && <div className="bg-red-50 text-red-800 p-4 rounded-lg">{error}</div>;
}
```

## Best Practices for Working with Data Flow

1. **Keep API logic separate** from UI components
2. **Use TypeScript interfaces** to ensure data consistency
3. **Implement proper error handling** at all levels
4. **Cache data when appropriate** to improve performance
5. **Use context for shared state** that many components need
6. **Keep component state as local as possible** for better performance
