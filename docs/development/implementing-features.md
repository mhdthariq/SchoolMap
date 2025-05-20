# Implementing New Features

This guide provides examples and patterns for implementing new features in the School Map Application. Follow these examples to maintain consistency and leverage existing patterns.

## Table of Contents

1. [Adding a New API Endpoint](#adding-a-new-api-endpoint)
2. [Creating a New UI Component](#creating-a-new-ui-component)
3. [Adding a New Map Layer](#adding-a-new-map-layer)
4. [Implementing a New Filter](#implementing-a-new-filter)
5. [Creating a Data Visualization](#creating-a-data-visualization)
6. [Adding User Preferences](#adding-user-preferences)
7. [Implementing Internationalization](#implementing-internationalization)

## Adding a New API Endpoint

Follow this pattern to add a new API endpoint to the application:

### 1. Create a New Route File

Create a new file in the `src/app/api` directory with a descriptive name:

```typescript
// src/app/api/example/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

// Define the response type (if needed)
type ExampleResponse = {
  id: number;
  name: string;
  value: number;
};

export async function GET() {
  try {
    const result = await pool.query<ExampleResponse>(`
      SELECT id, name, value
      FROM example_table
      WHERE condition = true
      ORDER BY name
    `);

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json({ message: "No data found" }, { status: 404 });
    }

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching example data:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
```

### 2. Add Data Access Functions (Optional)

For complex data operations, add functions in `src/lib/data.ts`:

```typescript
// src/lib/data.ts
import db from "./db";

export async function getExampleData(param: string) {
  try {
    const result = await db.query(
      `
      SELECT id, name, value
      FROM example_table
      WHERE param = $1
      ORDER BY name
    `,
      [param]
    );

    return result.rows;
  } catch (error) {
    console.error("Database error in getExampleData:", error);
    throw error;
  }
}
```

### 3. Use the New Endpoint in Components

```typescript
// Example component using the new API endpoint
import { useState, useEffect } from "react";

export function ExampleComponent() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/example")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Example Data</h2>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.name}: {item.value}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Creating a New UI Component

Follow these steps to create a new UI component:

### 1. Create the Component File

```typescript
// src/components/ExampleComponent.tsx
import { useState } from "react";
import { FiInfo, FiAlertCircle } from "react-icons/fi";

// Define prop types
interface ExampleComponentProps {
  title: string;
  description?: string;
  type?: "info" | "warning" | "error";
  onAction?: () => void;
}

export default function ExampleComponent({
  title,
  description = "",
  type = "info",
  onAction,
}: ExampleComponentProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine icon and colors based on type
  const getTypeStyles = () => {
    switch (type) {
      case "warning":
        return {
          icon: <FiAlertCircle className="w-5 h-5 text-amber-500" />,
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
        };
      case "error":
        return {
          icon: <FiAlertCircle className="w-5 h-5 text-red-500" />,
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      default: // info
        return {
          icon: <FiInfo className="w-5 h-5 text-blue-500" />,
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
    }
  };

  const { icon, bgColor, borderColor } = getTypeStyles();

  return (
    <div className={`rounded-lg ${bgColor} border ${borderColor} p-4 mb-4`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>

          {description && (
            <div
              className={`mt-2 text-sm text-gray-700 ${
                isExpanded ? "" : "line-clamp-2"
              }`}
            >
              {description}
            </div>
          )}

          <div className="mt-3 flex space-x-4">
            {description && description.length > 120 && (
              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}

            {onAction && (
              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
                onClick={onAction}
              >
                Take action
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 2. Use the Component in Your Application

```tsx
import ExampleComponent from "@/components/ExampleComponent";

export default function Page() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Example Page</h1>

      <ExampleComponent
        title="Information Message"
        description="This is an example information message. It provides helpful context to the user."
        type="info"
      />

      <ExampleComponent
        title="Warning Message"
        description="This is an example warning message. It alerts the user to a potential issue."
        type="warning"
        onAction={() => alert("Action taken!")}
      />
    </div>
  );
}
```

## Adding a New Map Layer

To add a new map layer option to the application:

### 1. Update the Layer Definitions

```typescript
// src/components/map/LayerSwitcher.tsx
export const MAP_LAYERS = {
  osm: {
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    name: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  },
  // Add your new layer here
  terrain: {
    name: "Terrain",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    subdomains: "abc",
  },
};
```

### 2. Ensure the LayerSwitcher Component Supports the New Layer

```typescript
// Update the LayerSwitcher component if needed
interface LayerSwitcherProps {
  currentLayer: keyof typeof MAP_LAYERS;
  onLayerChange: (layer: keyof typeof MAP_LAYERS) => void;
}

export default function LayerSwitcher({
  currentLayer,
  onLayerChange,
}: LayerSwitcherProps) {
  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <div className="bg-white rounded-lg shadow-lg p-2">
        <div className="text-sm font-medium text-gray-700 mb-2 px-1">
          Map Style
        </div>
        <div className="space-y-1">
          {Object.entries(MAP_LAYERS).map(([key, layer]) => (
            <button
              key={key}
              className={`w-full px-3 py-2 text-left text-sm rounded-md transition-colors
                ${
                  currentLayer === key
                    ? "bg-blue-100 text-blue-800"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              onClick={() => onLayerChange(key as keyof typeof MAP_LAYERS)}
            >
              {layer.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Implementing a New Filter

To add a new filter for school data:

### 1. Add Filter State to the Main Component

```typescript
// In src/app/page.tsx
export default function HomePage() {
  // Existing state
  const [sekolahData, setSekolahData] = useState<Sekolah[]>([]);
  const [schoolTypeFilter, setSchoolTypeFilter] = useState<string | null>(null);

  // Add new filter state
  const [accreditationFilter, setAccreditationFilter] = useState<string | null>(
    null
  );

  // Pass the new filter to the Map component
  return (
    <DynamicLocationProvider>
      <main className="relative w-full h-screen">
        <Sidebar
          // existing props
          onAccreditationFilter={setAccreditationFilter}
          activeAccreditationFilter={accreditationFilter}
        />

        <Map
          data={sekolahData}
          // existing props
          schoolTypeFilter={schoolTypeFilter}
          accreditationFilter={accreditationFilter}
        />
      </main>
    </DynamicLocationProvider>
  );
}
```

### 2. Update the Map Component to Use the New Filter

```typescript
// In src/components/map/Map.tsx
interface MapProps {
  data: Sekolah[];
  // existing props
  schoolTypeFilter: string | null;
  accreditationFilter: string | null; // Add new filter prop
}

export default function Map({
  data,
  // existing props
  schoolTypeFilter,
  accreditationFilter,
}: MapProps) {
  // Update the filter logic
  const shouldShowSchool = (school: Sekolah) => {
    // Existing filter logic
    if (schoolTypeFilter && school.bentuk_pendidikan !== schoolTypeFilter) {
      return false;
    }

    // Add new filter logic
    if (accreditationFilter && school.akreditasi !== accreditationFilter) {
      return false;
    }

    // Rest of existing logic
    return true;
  };

  // Rest of the Map component
}
```

### 3. Add UI for the New Filter

```typescript
// Add to Sidebar or create a new filter component
function AccreditationFilter({
  onFilterChange,
  activeFilter,
}: {
  onFilterChange: (value: string | null) => void;
  activeFilter: string | null;
}) {
  const accreditationOptions = [
    { value: "A", label: "A (Excellent)" },
    { value: "B", label: "B (Good)" },
    { value: "C", label: "C (Satisfactory)" },
    { value: "TT", label: "Not Accredited" },
  ];

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Filter by Accreditation
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-3 py-1.5 text-xs rounded-full border 
            ${
              activeFilter === null
                ? "bg-blue-100 border-blue-300 text-blue-800"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          onClick={() => onFilterChange(null)}
        >
          All
        </button>

        {accreditationOptions.map((option) => (
          <button
            key={option.value}
            className={`px-3 py-1.5 text-xs rounded-full border 
              ${
                activeFilter === option.value
                  ? "bg-blue-100 border-blue-300 text-blue-800"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            onClick={() => onFilterChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

## Creating a Data Visualization

Here's an example of how to add a new data visualization to the application:

### 1. Create a Visualization Component

```typescript
// src/components/visualizations/SchoolDistributionChart.tsx
import { useState, useEffect } from "react";
import { Sekolah } from "@/types/school";

interface SchoolDistributionChartProps {
  data: Sekolah[];
}

export default function SchoolDistributionChart({
  data,
}: SchoolDistributionChartProps) {
  const [chartData, setChartData] = useState<{ type: string; count: number }[]>(
    []
  );

  useEffect(() => {
    if (!data.length) return;

    // Process data for visualization
    const typeCounts: Record<string, number> = {};

    data.forEach((school) => {
      const type = school.bentuk_pendidikan || "Unknown";
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    // Convert to array format
    const chartDataArray = Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count,
    }));

    // Sort by count descending
    chartDataArray.sort((a, b) => b.count - a.count);

    setChartData(chartDataArray);
  }, [data]);

  // Calculate the maximum count for scaling
  const maxCount = Math.max(...chartData.map((item) => item.count), 0);

  // Generate colors for different school types
  const getBarColor = (type: string) => {
    switch (type) {
      case "SD":
        return "bg-green-500";
      case "SMP":
        return "bg-blue-500";
      case "SMA":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        School Distribution by Type
      </h3>

      {chartData.length === 0 ? (
        <div className="text-gray-500 text-center py-4">No data available</div>
      ) : (
        <div className="space-y-3">
          {chartData.map((item) => (
            <div key={item.type} className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {item.type}
                </span>
                <span className="text-sm text-gray-500">
                  {item.count} schools
                </span>
              </div>
              <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${getBarColor(item.type)}`}
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 2. Add the Visualization to a Page or Component

```typescript
// In a statistics page or sidebar component
import SchoolDistributionChart from "@/components/visualizations/SchoolDistributionChart";

export default function StatisticsPanel({ data }: { data: Sekolah[] }) {
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">School Statistics</h2>

      <SchoolDistributionChart data={data} />

      {/* Other visualizations or statistics */}
    </div>
  );
}
```

## Adding User Preferences

To add user preferences that persist across sessions:

### 1. Create a User Preferences Hook

```typescript
// src/hooks/useUserPreferences.ts
import { useState, useEffect } from "react";

type MapPreferences = {
  defaultLayer: string;
  showSchoolLabels: boolean;
  defaultZoom: number;
};

type RoutePreferences = {
  preferHighways: boolean;
  avoidTolls: boolean;
  transportMode: "car" | "walking" | "cycling";
};

export type UserPreferences = {
  map: MapPreferences;
  route: RoutePreferences;
  theme: "light" | "dark" | "system";
};

const DEFAULT_PREFERENCES: UserPreferences = {
  map: {
    defaultLayer: "osm",
    showSchoolLabels: true,
    defaultZoom: 13,
  },
  route: {
    preferHighways: true,
    avoidTolls: false,
    transportMode: "car",
  },
  theme: "system",
};

export function useUserPreferences() {
  const [preferences, setPreferences] =
    useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem("userPreferences");
      if (savedPrefs) {
        const parsedPrefs = JSON.parse(savedPrefs);
        setPreferences((prevPrefs) => ({
          ...prevPrefs,
          ...parsedPrefs,
        }));
      }
      setIsLoaded(true);
    } catch (error) {
      console.error("Error loading user preferences:", error);
      setIsLoaded(true);
    }
  }, []);

  // Update a specific preference and save to localStorage
  const updatePreference = <
    K extends keyof UserPreferences,
    SK extends keyof UserPreferences[K]
  >(
    category: K,
    key: SK,
    value: UserPreferences[K][SK]
  ) => {
    setPreferences((prevPrefs) => {
      const newPrefs = {
        ...prevPrefs,
        [category]: {
          ...prevPrefs[category],
          [key]: value,
        },
      };

      // Save to localStorage
      try {
        localStorage.setItem("userPreferences", JSON.stringify(newPrefs));
      } catch (error) {
        console.error("Error saving user preferences:", error);
      }

      return newPrefs;
    });
  };

  // Reset preferences to defaults
  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
    localStorage.removeItem("userPreferences");
  };

  return {
    preferences,
    updatePreference,
    resetPreferences,
    isLoaded,
  };
}
```

### 2. Create a User Preferences Context

```typescript
// src/contexts/PreferencesContext.tsx
import { createContext, useContext, ReactNode } from "react";
import {
  useUserPreferences,
  UserPreferences,
} from "@/hooks/useUserPreferences";

type PreferencesContextType = {
  preferences: UserPreferences;
  updatePreference: <
    K extends keyof UserPreferences,
    SK extends keyof UserPreferences[K]
  >(
    category: K,
    key: SK,
    value: UserPreferences[K][SK]
  ) => void;
  resetPreferences: () => void;
  isLoaded: boolean;
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined
);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const preferencesData = useUserPreferences();

  return (
    <PreferencesContext.Provider value={preferencesData}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
```

### 3. Use the Preferences in Components

```typescript
// Wrap your app with the provider
// In src/app/layout.tsx or another appropriate location
import { PreferencesProvider } from "@/contexts/PreferencesContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PreferencesProvider>{children}</PreferencesProvider>
      </body>
    </html>
  );
}

// Use preferences in a component
import { usePreferences } from "@/contexts/PreferencesContext";

function MapSettings() {
  const { preferences, updatePreference } = usePreferences();

  return (
    <div className="p-4">
      <h2 className="text-lg font-medium mb-4">Map Settings</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Default Map Layer
          </label>
          <select
            value={preferences.map.defaultLayer}
            onChange={(e) =>
              updatePreference("map", "defaultLayer", e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="osm">OpenStreetMap</option>
            <option value="satellite">Satellite</option>
            <option value="terrain">Terrain</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="showLabels"
            checked={preferences.map.showSchoolLabels}
            onChange={(e) =>
              updatePreference("map", "showSchoolLabels", e.target.checked)
            }
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="showLabels" className="ml-2 text-sm text-gray-700">
            Show school labels on map
          </label>
        </div>
      </div>
    </div>
  );
}
```

## Implementing Internationalization

To add multi-language support to the application:

### 1. Create Translation Files

```javascript
// src/locales/en.json
{
  "app": {
    "title": "School Map App",
    "tagline": "Find and explore schools in your area"
  },
  "map": {
    "layers": {
      "title": "Map Layers",
      "osm": "Street Map",
      "satellite": "Satellite",
      "terrain": "Terrain"
    },
    "controls": {
      "zoomIn": "Zoom In",
      "zoomOut": "Zoom Out",
      "findMyLocation": "Find My Location"
    }
  },
  "school": {
    "types": {
      "SD": "Elementary School",
      "SMP": "Junior High School",
      "SMA": "Senior High School"
    },
    "details": {
      "address": "Address",
      "accreditation": "Accreditation",
      "status": "Status",
      "teacherCount": "Number of Teachers",
      "studentCount": "Number of Students",
      "getDirections": "Get Directions"
    }
  },
  "routing": {
    "title": "Route Planner",
    "startPoint": "Starting Point",
    "destination": "Destination",
    "myLocation": "My Current Location",
    "findLocation": "Find My Location",
    "getDirections": "Get Directions",
    "clearRoute": "Clear",
    "distance": "Distance",
    "duration": "Duration",
    "instructions": "Instructions"
  }
}

// src/locales/id.json (Indonesian translation)
{
  "app": {
    "title": "Aplikasi Peta Sekolah",
    "tagline": "Temukan dan jelajahi sekolah di area Anda"
  },
  "map": {
    "layers": {
      "title": "Lapisan Peta",
      "osm": "Peta Jalan",
      "satellite": "Satelit",
      "terrain": "Medan"
    },
    "controls": {
      "zoomIn": "Perbesar",
      "zoomOut": "Perkecil",
      "findMyLocation": "Temukan Lokasi Saya"
    }
  },
  "school": {
    "types": {
      "SD": "Sekolah Dasar",
      "SMP": "Sekolah Menengah Pertama",
      "SMA": "Sekolah Menengah Atas"
    },
    "details": {
      "address": "Alamat",
      "accreditation": "Akreditasi",
      "status": "Status",
      "teacherCount": "Jumlah Guru",
      "studentCount": "Jumlah Murid",
      "getDirections": "Dapatkan Petunjuk Arah"
    }
  },
  "routing": {
    "title": "Perencana Rute",
    "startPoint": "Titik Awal",
    "destination": "Tujuan",
    "myLocation": "Lokasi Saya Saat Ini",
    "findLocation": "Temukan Lokasi Saya",
    "getDirections": "Dapatkan Petunjuk",
    "clearRoute": "Hapus",
    "distance": "Jarak",
    "duration": "Durasi",
    "instructions": "Instruksi"
  }
}
```

### 2. Create a Translation Context

```typescript
// src/contexts/TranslationContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type SupportedLocale = "en" | "id";

type TranslationContextType = {
  t: (key: string) => string;
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  isLoading: boolean;
};

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<SupportedLocale>("en");
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load translations when locale changes
  useEffect(() => {
    setIsLoading(true);

    // Dynamic import based on locale
    import(`../locales/${locale}.json`)
      .then((module) => {
        setTranslations(module.default);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(`Error loading translations for ${locale}:`, error);
        setIsLoading(false);
      });
  }, [locale]);

  // Function to get translated text
  const t = (key: string): string => {
    if (isLoading) return key;

    // Split the key by dots to access nested properties
    const keys = key.split(".");
    let value = translations;

    // Navigate through the object
    for (const k of keys) {
      if (value?.[k] === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
      value = value[k];
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <TranslationContext.Provider value={{ t, locale, setLocale, isLoading }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}
```

### 3. Use Translations in Components

```typescript
// Wrap your app with the provider
import { TranslationProvider } from "@/contexts/TranslationContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TranslationProvider>{children}</TranslationProvider>
      </body>
    </html>
  );
}

// Use translations in a component
import { useTranslation } from "@/contexts/TranslationContext";

function Header() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <header className="bg-indigo-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">{t("app.title")}</h1>
          <p className="text-sm opacity-80">{t("app.tagline")}</p>
        </div>

        <div>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as "en" | "id")}
            className="bg-indigo-700 text-white px-3 py-1 rounded-md border border-indigo-500"
          >
            <option value="en">English</option>
            <option value="id">Indonesian</option>
          </select>
        </div>
      </div>
    </header>
  );
}
```

These examples provide a starting point for implementing new features in the School Map Application. Adapt them according to your specific requirements while maintaining consistency with the existing codebase.
