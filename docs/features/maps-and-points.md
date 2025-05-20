# Maps and Points Documentation

This document explains how school points are displayed on the map in the School Map App.

## How School Points Work

School points are stored in the database and displayed on the map as markers. Each school has a specific marker color based on its type (SD, SMP, SMA).

## Database Structure

The application uses a PostgreSQL database with a `sekolah` table that has geographical coordinates for each school:

```sql
CREATE TABLE sekolah (
  uuid UUID PRIMARY KEY,
  npsn VARCHAR(20) UNIQUE NOT NULL,
  nama VARCHAR(255) NOT NULL,
  alamat TEXT,
  kelurahan_id INTEGER REFERENCES kelurahan(id),
  bentuk_pendidikan VARCHAR(50),
  status VARCHAR(50),
  akreditasi VARCHAR(10),
  jumlah_siswa INTEGER,
  jumlah_guru INTEGER,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL
);
```

The most important fields for mapping are:

- `lat`: The latitude coordinate of the school
- `lng`: The longitude coordinate of the school
- `bentuk_pendidikan`: The school type (SD, SMP, or SMA) which determines the marker color

## How to Implement School Points

### 1. Fetching School Data

The app fetches school data from the API endpoint:

```typescript
// In src/app/page.tsx
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

### 2. Creating the API Endpoint

The API endpoint queries the database and returns the schools:

```typescript
// In src/app/api/sekolah/route.ts
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

### 3. Displaying the Schools on the Map

The schools are rendered as markers in the Map component:

```tsx
// In src/components/map/Map.tsx
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

### 4. Determining Marker Icons

The app uses different marker icons based on school type:

```tsx
// Get the appropriate icon for a school
const getSchoolIcon = (school: Sekolah) => {
  if (selectedSchool?.uuid === school.uuid) {
    return redMarkerIcon;
  }

  if (routeOrigin === school.uuid) {
    return originIcon;
  }

  if (routeDestination === school.uuid) {
    return destinationIcon;
  }

  // Use type-specific icons based on school type
  if (school.bentuk_pendidikan?.includes("SD")) return iconSD;
  if (school.bentuk_pendidikan?.includes("SMP")) return iconSMP;
  if (school.bentuk_pendidikan?.includes("SMA")) return iconSMA;

  return defaultIcon;
};
```

## Customizing School Points

To customize how school points appear:

1. **Change marker icons**: Modify the icon definitions in `src/components/map/Map.tsx`
2. **Add new school types**: Add new icon mappings in the `getSchoolIcon` function
3. **Change marker behavior**: Modify the `eventHandlers` in the Marker component

## Filtering School Points

The app supports filtering school points by:

1. **School type**: Using the `schoolTypeFilter` state
2. **Administrative area**: Using the `kelurahanFilter` state

The filtering is handled by the `shouldShowSchool` function:

```tsx
const shouldShowSchool = (school: Sekolah) => {
  // First, check kelurahan filter if active
  if (kelurahanFilter && school.kelurahan_id !== kelurahanFilter) {
    return false;
  }

  // If a school type filter is active, only show schools of that type
  if (schoolTypeFilter && school.bentuk_pendidikan !== schoolTypeFilter) {
    return false;
  }

  // If a school is selected, only show that school
  if (selectedSchool !== null) {
    return selectedSchool.uuid === school.uuid;
  }

  // If routing is active, only show origin and destination schools
  if (isRoutingActive) {
    return routeOrigin === school.uuid || routeDestination === school.uuid;
  }

  // Otherwise, show all schools (that match the current type filter if any)
  return true;
};
```
