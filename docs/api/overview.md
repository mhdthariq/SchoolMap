# API Overview

The School Map App uses Next.js API routes to provide data to the frontend. This document provides an overview of the API architecture and common patterns.

## API Architecture

The API follows RESTful principles and is implemented using Next.js API routes, which are serverless functions that run on-demand. The API routes are located in the `src/app/api` directory.

### Key API Endpoints

| Endpoint                                                 | Description                                        |
| -------------------------------------------------------- | -------------------------------------------------- |
| [`/api/sekolah`](./endpoints/sekolah.md)                 | Retrieves school data                              |
| [`/api/kelurahan`](./endpoints/kelurahan.md)             | Retrieves administrative area boundaries           |
| [`/api/kelurahan-stats`](./endpoints/kelurahan-stats.md) | Retrieves school statistics by administrative area |
| [`/api/location`](./endpoints/location.md)               | Handles location-related functionality             |
| [`/api/test-db`](./endpoints/test-db.md)                 | Tests database connectivity                        |

For detailed documentation of each endpoint, click on the endpoint link above.

## Database Connection

The API connects to a PostgreSQL database using the `node-postgres` library. The database connection is managed in `src/lib/db.ts`:

```typescript
// src/lib/db.ts
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default {
  query: (text: string, params?: any[]) => pool.query(text, params),
};
```

## API Implementation Pattern

Each API endpoint follows a similar pattern:

1. Import necessary dependencies
2. Define the handler function
3. Execute database queries or other operations
4. Return a JSON response

Example:

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

## Error Handling

API endpoints implement consistent error handling:

1. Wrap operations in try/catch blocks
2. Log errors to the console
3. Return appropriate HTTP status codes
4. Include error messages in the response

## Data Operations

Database operations are typically abstracted into functions in the `src/lib/data.ts` file:

```typescript
// src/lib/data.ts
import db from "./db";

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

## Response Format

API responses follow a consistent format:

- Success responses return the requested data directly
- Error responses include an `error` property with a message

## Accessing the API

Frontend components access the API using the `fetch` API:

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

## Adding New API Endpoints

To add a new API endpoint:

1. Create a new file in the `src/app/api` directory
2. Create a handler function for the appropriate HTTP method
3. Add any necessary data operations to `src/lib/data.ts`
4. Update the API documentation

Example of adding a new endpoint:

```typescript
// src/app/api/example/route.ts
import { NextResponse } from "next/server";
import { someDataFunction } from "@/lib/data";

export async function GET() {
  try {
    const data = await someDataFunction();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
```

## API Security

Currently, the API does not implement authentication or authorization. In a production environment, you may want to add:

- API route handlers that validate requests
- Rate limiting to prevent abuse
- Authentication for sensitive operations

## Testing API Endpoints

You can test API endpoints using tools like:

- Browser developer tools
- Postman
- curl
- Automated tests using Jest or other testing frameworks
