# Administrative Areas API Endpoint

This document provides detailed information about the `/api/kelurahan` endpoint for retrieving administrative area (kelurahan) boundary data in the School Map Application.

## Endpoint Overview

- **URL**: `/api/kelurahan`
- **Method**: GET
- **Description**: Retrieves geographical boundaries and information for all administrative areas (kelurahan).

## Response Format

The endpoint returns an array of administrative area objects with the following properties:

| Property    | Type    | Description                                           |
| ----------- | ------- | ----------------------------------------------------- |
| `id`        | Number  | Unique identifier for the administrative area         |
| `kelurahan` | String  | Name of the administrative area (kelurahan)           |
| `kecamatan` | String  | Name of the district (kecamatan) containing this area |
| `provinsi`  | String  | Name of the province containing this area             |
| `kode_pos`  | String  | Postal code for this area                             |
| `luas`      | Number  | Area size in square kilometers                        |
| `geometry`  | GeoJSON | GeoJSON representation of the area's boundary         |

## Example Response

```json
[
  {
    "id": 1,
    "kelurahan": "Medan Denai",
    "kecamatan": "Medan Denai",
    "provinsi": "Sumatera Utara",
    "kode_pos": "20227",
    "luas": 2.34,
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [98.6722, 3.5952],
          [98.673, 3.596],
          [98.674, 3.5955],
          [98.6735, 3.5945],
          [98.6722, 3.5952]
        ]
      ]
    }
  }
  // Additional administrative area entries...
]
```

## Error Responses

| Status Code | Description                                   | Response Body                                                      |
| ----------- | --------------------------------------------- | ------------------------------------------------------------------ |
| 404         | No administrative areas found in the database | `{ "message": "No kelurahan data found" }`                         |
| 500         | Server-side error                             | `{ "error": "Internal server error", "details": "Error message" }` |

## Implementation Details

The implementation uses the following SQL query to fetch administrative area data:

```sql
SELECT
  id, kelurahan, kecamatan, provinsi, kode_pos, luas,
  ST_AsGeoJSON(geometri) AS geometry
FROM kelurahan
```

The query:

- Retrieves basic information about each administrative area from the `kelurahan` table
- Uses PostGIS function `ST_AsGeoJSON` to convert the geometry column to a GeoJSON format
- The resulting GeoJSON is then parsed from a string to a proper JSON object before being returned

## Usage in the Application

This endpoint is used in the application to:

1. Render administrative area boundaries on the map as polygons
2. Provide context for school locations
3. Display statistical information for each administrative area
4. Support filtering schools by administrative area

## Code Example

Here's how this endpoint is typically used to display administrative area boundaries:

```typescript
// Example of fetching and displaying administrative area boundaries
useEffect(() => {
  fetch("/api/kelurahan")
    .then((res) => res.json())
    .then((data) => {
      // Create GeoJSON layer for administrative areas
      const polygonLayer = L.geoJSON(
        data.map((area) => ({
          type: "Feature",
          properties: {
            id: area.id,
            name: area.kelurahan,
            district: area.kecamatan,
          },
          geometry: area.geometry,
        })),
        {
          style: {
            color: "#3388ff",
            weight: 2,
            opacity: 0.6,
            fillOpacity: 0.1,
          },
          onEachFeature: (feature, layer) => {
            layer.bindTooltip(feature.properties.name);
          },
        }
      ).addTo(map);
    })
    .catch((err) => {
      console.error("Error loading administrative areas:", err);
    });
}, [map]);
```
