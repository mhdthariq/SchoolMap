# Database Test API Endpoint

This document provides information about the `/api/test-db` endpoint for verifying database connectivity in the School Map Application.

## Endpoint Overview

- **URL**: `/api/test-db`
- **Method**: GET
- **Description**: Tests the connection to the PostgreSQL database and returns the current timestamp if successful.

## Response Format

### Successful Response

The endpoint returns a JSON object with the following properties when the database connection is successful:

| Property  | Type    | Description                                              |
| --------- | ------- | -------------------------------------------------------- |
| `success` | Boolean | `true` indicating the database connection was successful |
| `time`    | String  | Current timestamp from the database server               |

Example successful response:

```json
{
  "success": true,
  "time": "2023-05-15T14:30:45.123Z"
}
```

### Error Response

If the database connection fails, the endpoint returns:

| Property  | Type    | Description                                       |
| --------- | ------- | ------------------------------------------------- |
| `success` | Boolean | `false` indicating the database connection failed |
| `error`   | String  | Error message describing the failure              |

Example error response:

```json
{
  "success": false,
  "error": "Failed to connect to DB"
}
```

## Implementation Details

The implementation uses a simple SQL query to test database connectivity:

```sql
SELECT NOW()
```

This query:

- Requests the current timestamp from the PostgreSQL server
- Does not depend on application-specific tables
- Is very lightweight and quick to execute

## Usage

This endpoint is primarily used for:

1. Verifying database connectivity during application setup
2. Troubleshooting connection issues
3. Monitoring database availability

It's particularly useful during initial deployment or when diagnosing problems with the application.

## Code Example

Here's how this endpoint might be used in a deployment script or monitoring tool:

```javascript
// Example of checking database connectivity
const checkDatabaseConnection = async () => {
  try {
    const response = await fetch("/api/test-db");
    const data = await response.json();

    if (data.success) {
      console.log("Database connection successful", data.time);
      return true;
    } else {
      console.error("Database connection failed:", data.error);
      return false;
    }
  } catch (error) {
    console.error("Error checking database connection:", error);
    return false;
  }
};

// Use in deployment verification
checkDatabaseConnection().then((isConnected) => {
  if (isConnected) {
    console.log("Application is ready to use");
  } else {
    console.error("Database connection issue. Check configuration");
  }
});
```
