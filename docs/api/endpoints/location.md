# Location API Endpoint

This document provides detailed information about the `/api/location` endpoint for handling user location data in the School Map Application.

## Endpoint Overview

- **URL**: `/api/location`
- **Methods**: GET, POST
- **Description**: Manages user location data, allowing storing and retrieving location coordinates.

## POST Method

### Request Format

The POST method expects a JSON body with the following properties:

| Property | Type   | Description                                 | Required |
| -------- | ------ | ------------------------------------------- | -------- |
| `lat`    | Number | Latitude coordinate of the user's location  | Yes      |
| `lng`    | Number | Longitude coordinate of the user's location | Yes      |

Example request body:

```json
{
  "lat": 3.5952,
  "lng": 98.6722
}
```

### Response Format

The endpoint returns a JSON object with the following properties:

| Property  | Type    | Description                                      |
| --------- | ------- | ------------------------------------------------ |
| `success` | Boolean | Indicates if the operation was successful        |
| `message` | String  | A message describing the result of the operation |
| `data`    | Object  | An object containing the stored location data    |

Example successful response:

```json
{
  "success": true,
  "message": "Location saved successfully",
  "data": {
    "lat": 3.5952,
    "lng": 98.6722,
    "timestamp": 1678901234567
  }
}
```

### Error Responses

| Status Code | Description             | Response Body                                                      |
| ----------- | ----------------------- | ------------------------------------------------------------------ |
| 400         | Missing required fields | `{ "error": "Missing required fields: lat and lng" }`              |
| 500         | Server-side error       | `{ "error": "Internal server error", "details": "Error message" }` |

## GET Method

### Request Format

The GET method doesn't require any parameters in the request body, but it can use request headers to identify the user:

| Header      | Description                                                     |
| ----------- | --------------------------------------------------------------- |
| `x-user-id` | (Optional) User identifier to retrieve specific user's location |

### Response Format

The endpoint returns the location data for the requested user:

| Property    | Type   | Description                                       |
| ----------- | ------ | ------------------------------------------------- |
| `lat`       | Number | Latitude coordinate of the user's location        |
| `lng`       | Number | Longitude coordinate of the user's location       |
| `timestamp` | Number | Unix timestamp when the location was last updated |

Example successful response:

```json
{
  "lat": 3.5952,
  "lng": 98.6722,
  "timestamp": 1678901234567
}
```

### Error Responses

| Status Code | Description            | Response Body                                                      |
| ----------- | ---------------------- | ------------------------------------------------------------------ |
| 404         | No location data found | `{ "error": "No location data found for this user" }`              |
| 500         | Server-side error      | `{ "error": "Internal server error", "details": "Error message" }` |

## Implementation Details

The location API uses in-memory storage for demonstration purposes. In a production environment, this would be replaced with database storage.

The implementation:

- Stores location data with timestamps
- Associates locations with user IDs (defaults to "default-user" if not specified)
- Validates required fields in POST requests

## Usage in the Application

This endpoint is used in the application to:

1. Store the user's current location when they use the "Find My Location" feature
2. Retrieve previously stored locations for navigation
3. Support the routing feature for planning routes from the user's location to schools
4. Enable the "Use My Location" option in the routing sidebar

## Code Example

Here's how this endpoint is typically used in the application:

```typescript
// Example of saving user location
const saveUserLocation = async (position: GeolocationPosition) => {
  try {
    const { latitude, longitude } = position.coords;

    await fetch("/api/location", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lat: latitude,
        lng: longitude,
      }),
    });

    // Update the local state with the new location
    setUserLocation(L.latLng(latitude, longitude));
  } catch (error) {
    console.error("Error saving location:", error);
  }
};

// Example of retrieving user location
const getUserLocation = async () => {
  try {
    const response = await fetch("/api/location");

    if (response.ok) {
      const locationData = await response.json();
      setUserLocation(L.latLng(locationData.lat, locationData.lng));

      // Center map on user location
      if (mapRef.current) {
        mapRef.current.setView([locationData.lat, locationData.lng], 15);
      }
    }
  } catch (error) {
    console.error("Error retrieving location:", error);
  }
};
```

## Notes

- For privacy reasons, the user's location is only stored when explicitly requested
- In a production environment, proper authentication and authorization should be implemented
- Consider adding data retention policies for location data
