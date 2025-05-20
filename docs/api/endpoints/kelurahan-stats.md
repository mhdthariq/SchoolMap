# Administrative Area Statistics API Endpoint

This document provides detailed information about the `/api/kelurahan-stats` endpoint for retrieving school statistics by administrative area in the School Map Application.

## Endpoint Overview

- **URL**: `/api/kelurahan-stats`
- **Method**: GET
- **Description**: Retrieves statistical data about school distribution across administrative areas (kelurahan).

## Response Format

The endpoint returns an array of statistics objects with the following properties:

| Property        | Type   | Description                                      |
| --------------- | ------ | ------------------------------------------------ |
| `id`            | Number | Unique identifier for the administrative area    |
| `kelurahan`     | String | Name of the administrative area                  |
| `kecamatan`     | String | Name of the district containing this area        |
| `total_schools` | Number | Total number of schools in this area             |
| `sd_count`      | Number | Number of elementary schools (SD) in this area   |
| `smp_count`     | Number | Number of junior high schools (SMP) in this area |
| `sma_count`     | Number | Number of senior high schools (SMA) in this area |

## Example Response

```json
[
  {
    "id": 1,
    "kelurahan": "Medan Denai",
    "kecamatan": "Medan Denai",
    "total_schools": 15,
    "sd_count": 10,
    "smp_count": 3,
    "sma_count": 2
  },
  {
    "id": 2,
    "kelurahan": "Medan Tenggara",
    "kecamatan": "Medan Denai",
    "total_schools": 8,
    "sd_count": 5,
    "smp_count": 2,
    "sma_count": 1
  }
  // Additional statistics entries...
]
```

## Error Responses

| Status Code | Description                         | Response Body                                                      |
| ----------- | ----------------------------------- | ------------------------------------------------------------------ |
| 404         | No statistics found in the database | `{ "message": "No statistics found" }`                             |
| 500         | Server-side error                   | `{ "error": "Internal server error", "details": "Error message" }` |

## Implementation Details

The implementation uses the following SQL query to calculate statistics:

```sql
SELECT
  k.id,
  k.kelurahan,
  k.kecamatan,
  COUNT(s.uuid) AS total_schools,
  COUNT(CASE WHEN s.bentuk_pendidikan = 'SD' THEN 1 END) AS sd_count,
  COUNT(CASE WHEN s.bentuk_pendidikan = 'SMP' THEN 1 END) AS smp_count,
  COUNT(CASE WHEN s.bentuk_pendidikan = 'SMA' THEN 1 END) AS sma_count
FROM kelurahan k
LEFT JOIN sekolah s ON k.id = s.kelurahan_id
GROUP BY k.id, k.kelurahan, k.kecamatan
ORDER BY k.kelurahan
```

The query:

- Joins the `kelurahan` and `sekolah` tables
- Uses SQL COUNT and CASE expressions to calculate the total and type-specific school counts
- Groups the results by administrative area
- Uses LEFT JOIN to include areas with no schools

## Usage in the Application

This endpoint is used in the application to:

1. Generate statistical visualizations about school distribution
2. Display school counts in the statistics sidebar
3. Create choropleth maps showing school density by area
4. Support data analysis features

## Code Example

Here's how this endpoint is typically used in the application:

```typescript
// Example of fetching and using administrative area statistics
useEffect(() => {
  fetch("/api/kelurahan-stats")
    .then((res) => res.json())
    .then((data) => {
      setStatisticsData(data);

      // Calculate average schools per area
      const totalAreas = data.length;
      const totalSchools = data.reduce(
        (sum, area) => sum + area.total_schools,
        0
      );
      setAverageSchools(totalSchools / totalAreas);

      // Find area with most schools
      const maxArea = data.reduce(
        (max, area) => (area.total_schools > max.total_schools ? area : max),
        data[0]
      );
      setMaxSchoolsArea(maxArea);
    })
    .catch((err) => {
      console.error("Error loading statistics:", err);
    });
}, []);
```
