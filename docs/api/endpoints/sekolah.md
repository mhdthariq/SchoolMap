# School Data API Endpoint

This document provides detailed information about the `/api/sekolah` endpoint for retrieving school data in the School Map Application.

## Endpoint Overview

- **URL**: `/api/sekolah`
- **Method**: GET
- **Description**: Retrieves a list of all schools with their detailed information, including geographic coordinates.

## Response Format

The endpoint returns an array of school objects with the following properties:

| Property            | Type   | Description                                                             |
| ------------------- | ------ | ----------------------------------------------------------------------- |
| `uuid`              | String | Unique identifier for the school                                        |
| `nama`              | String | Name of the school                                                      |
| `npsn`              | String | National School ID number                                               |
| `alamat`            | String | Physical address of the school                                          |
| `status`            | String | Status of the school (e.g., "Negeri" or "Swasta")                       |
| `bentuk_pendidikan` | String | Type of school (e.g., "SD", "SMP", "SMA")                               |
| `akreditasi`        | String | Accreditation status of the school                                      |
| `jumlah_guru`       | Number | Number of teachers at the school                                        |
| `jumlah_murid`      | Number | Number of students at the school                                        |
| `lng`               | Number | Longitude coordinate of the school location                             |
| `lat`               | Number | Latitude coordinate of the school location                              |
| `kelurahan_id`      | Number | ID of the administrative area (kelurahan) where the school is located   |
| `kelurahan_nama`    | String | Name of the administrative area (kelurahan) where the school is located |

## Example Response

```json
[
  {
    "uuid": "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
    "nama": "SD Negeri 123 Medan",
    "npsn": "12345678",
    "alamat": "Jl. Contoh No. 123, Medan",
    "status": "Negeri",
    "bentuk_pendidikan": "SD",
    "akreditasi": "A",
    "jumlah_guru": 25,
    "jumlah_murid": 350,
    "lng": 98.6722,
    "lat": 3.5952,
    "kelurahan_id": 1,
    "kelurahan_nama": "Medan Denai"
  }
  // Additional school entries...
]
```

## Error Responses

| Status Code | Description                      | Response Body                                                      |
| ----------- | -------------------------------- | ------------------------------------------------------------------ |
| 404         | No schools found in the database | `{ "message": "No schools found" }`                                |
| 500         | Server-side error                | `{ "error": "Internal server error", "details": "Error message" }` |

## Implementation Details

The implementation uses the following SQL query to fetch school data:

```sql
SELECT
  s.uuid, s.nama, s.npsn, s.alamat, s.status, s.bentuk_pendidikan, s.akreditasi,
  s.jumlah_guru, s.jumlah_murid,
  ST_X(s.geometri) AS lng,
  ST_Y(s.geometri) AS lat,
  s.kelurahan_id,
  k.kelurahan AS kelurahan_nama
FROM sekolah s
JOIN kelurahan k ON s.kelurahan_id = k.id
```

The query:

- Retrieves basic information about each school from the `sekolah` table
- Uses PostGIS functions (`ST_X` and `ST_Y`) to extract longitude and latitude from the geometry column
- Joins with the `kelurahan` table to include the name of the administrative area

## Usage in the Application

This endpoint is used in the application to:

1. Initialize the map with school markers
2. Populate the school search functionality
3. Provide data for school selection in routing features
4. Display detailed information about schools in popups

## Code Example

Here's how this endpoint is typically used in the application:

```typescript
// Example of fetching school data
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
