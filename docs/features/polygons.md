# Polygons Documentation

This document explains how administrative area polygons are displayed and used in the School Map App.

## How Polygons Work

Administrative area polygons (kelurahan boundaries) are stored in the database and displayed on the map as interactive polygon overlays. These polygons help visualize school distribution across different administrative areas.

## Database Structure

The application uses a PostgreSQL database with a `kelurahan` table that has a GeoJSON representation of each boundary:

```sql
CREATE TABLE kelurahan (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  geom GEOMETRY(MultiPolygon, 4326),
  boundary JSONB -- Stores GeoJSON representation of the boundary
);
```

The most important fields for polygon rendering are:

- `boundary`: The GeoJSON representation of the kelurahan boundary
- `geom`: The spatial geometry data (using PostGIS)

## How to Implement Administrative Area Polygons

### 1. Fetching Polygon Data

The app fetches kelurahan boundary data from the API endpoint:

```typescript
// In src/components/map/PolygonControl.tsx
useEffect(() => {
  // Fetch kelurahan data only when the component mounts
  async function fetchKelurahan() {
    try {
      const response = await fetch("/api/kelurahan");
      const data = await response.json();
      setKelurahanData(data);
    } catch (error) {
      console.error("Error fetching kelurahan data:", error);
    }
  }

  fetchKelurahan();
}, []);
```

### 2. Creating the API Endpoint

The API endpoint queries the database and returns the kelurahan boundaries:

```typescript
// In src/app/api/kelurahan/route.ts
import { getKelurahan } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const kelurahan = await getKelurahan();
    return NextResponse.json(kelurahan);
  } catch (error) {
    console.error("Error fetching kelurahan:", error);
    return NextResponse.json(
      { error: "Failed to fetch kelurahan" },
      { status: 500 }
    );
  }
}
```

### 3. The Database Query

The database query needs to extract and format the boundary data:

```typescript
// In src/lib/data.ts
export async function getKelurahan() {
  try {
    const result = await db.query(`
      SELECT 
        id, 
        nama, 
        boundary
      FROM kelurahan
      ORDER BY nama
    `);
    return result.rows;
  } catch (error) {
    console.error("Database error in getKelurahan:", error);
    throw error;
  }
}
```

### 4. Displaying the Polygons on the Map

The polygons are rendered in the PolygonControl component:

```tsx
// In src/components/map/PolygonControl.tsx
return (
  <>
    {kelurahanData.map((kelurahan) => (
      <GeoJSON
        key={kelurahan.id}
        data={kelurahan.boundary}
        style={() => ({
          color:
            selectedKelurahanId === kelurahan.id
              ? "#3B82F6" // Blue for selected
              : "#9CA3AF", // Gray for unselected
          weight: selectedKelurahanId === kelurahan.id ? 3 : 1,
          opacity: 0.7,
          fillColor:
            selectedKelurahanId === kelurahan.id
              ? "#93C5FD" // Light blue fill for selected
              : "#F3F4F6", // Light gray fill for unselected
          fillOpacity: selectedKelurahanId === kelurahan.id ? 0.3 : 0.1,
        })}
        eventHandlers={{
          click: () => {
            handleKelurahanClick(kelurahan.id);
          },
        }}
      >
        <Tooltip sticky>{kelurahan.nama}</Tooltip>
      </GeoJSON>
    ))}
  </>
);
```

### 5. Interactive Features

The polygons support several interactive features:

- **Highlighting**: Polygons are highlighted when selected
- **Tooltips**: Showing the name of the administrative area
- **Filtering**: Clicking a polygon can filter schools to show only those within that area

## Customizing Polygons

To customize how polygons appear:

1. **Change styles**: Modify the style function in the GeoJSON component
2. **Add new interactions**: Modify the `eventHandlers` in the GeoJSON component
3. **Change tooltip behavior**: Customize the Tooltip component

## Getting School Counts per Polygon

The app can display statistics about how many schools are in each kelurahan:

```typescript
// In src/app/api/kelurahan-stats/route.ts
export async function GET() {
  try {
    const result = await db.query(`
      SELECT 
        k.id,
        k.nama,
        COUNT(s.uuid) AS total_schools,
        SUM(CASE WHEN s.bentuk_pendidikan = 'SD' THEN 1 ELSE 0 END) AS sd_count,
        SUM(CASE WHEN s.bentuk_pendidikan = 'SMP' THEN 1 ELSE 0 END) AS smp_count,
        SUM(CASE WHEN s.bentuk_pendidikan = 'SMA' THEN 1 ELSE 0 END) AS sma_count
      FROM 
        kelurahan k
      LEFT JOIN 
        sekolah s ON k.id = s.kelurahan_id
      GROUP BY 
        k.id, k.nama
      ORDER BY 
        k.nama
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching kelurahan statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch kelurahan statistics" },
      { status: 500 }
    );
  }
}
```

This data can be used to add visual weight to polygons based on school density or to display in the statistics sidebar.
