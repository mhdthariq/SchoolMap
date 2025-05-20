# Database Setup Guide

This guide provides detailed instructions on setting up the PostgreSQL database for the School Map App.

## Prerequisites

- PostgreSQL 12 or higher
- PostGIS extension installed
- Basic knowledge of SQL

## Database Schema

The School Map App requires two main tables:

1. `sekolah` - Contains school information
2. `kelurahan` - Contains administrative area boundaries

### Creating the Database

```sql
CREATE DATABASE school_map_db;
```

Connect to the newly created database:

```sql
\c school_map_db
```

### Installing PostGIS Extension

The app uses spatial data capabilities provided by PostGIS:

```sql
CREATE EXTENSION postgis;
```

### Creating the Kelurahan Table

This table stores administrative area boundaries:

```sql
CREATE TABLE kelurahan (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  geom GEOMETRY(MultiPolygon, 4326),
  boundary JSONB -- Stores GeoJSON representation of the boundary
);
```

Key fields:

- `geom`: The spatial geometry data (stored as PostGIS geometry)
- `boundary`: The GeoJSON representation of the boundary for easy use in Leaflet

### Creating the Sekolah Table

This table stores school information:

```sql
CREATE TABLE sekolah (
  uuid UUID PRIMARY KEY,
  npsn VARCHAR(20) UNIQUE NOT NULL,
  nama VARCHAR(255) NOT NULL,
  alamat TEXT,
  kelurahan_id INTEGER REFERENCES kelurahan(id),
  bentuk_pendidikan VARCHAR(50), -- SD, SMP, SMA
  status VARCHAR(50), -- Negeri, Swasta
  akreditasi VARCHAR(10),
  jumlah_siswa INTEGER,
  jumlah_guru INTEGER,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL
);
```

Key fields:

- `lat` and `lng`: Geographic coordinates for mapping
- `bentuk_pendidikan`: The school type (SD, SMP, SMA) used for filtering and markers
- `kelurahan_id`: Foreign key to the kelurahan table

## Importing Data

### Importing Administrative Boundaries

You can import kelurahan boundaries from a GeoJSON file:

```sql
-- First, create a temporary table to hold the GeoJSON
CREATE TEMP TABLE temp_kelurahan (
  data JSONB
);

-- Import the GeoJSON file
COPY temp_kelurahan FROM '/path/to/kelurahan.json';

-- Insert the data into the kelurahan table
INSERT INTO kelurahan (nama, geom, boundary)
SELECT
  data->>'name' AS nama,
  ST_GeomFromGeoJSON(data->'geometry') AS geom,
  data->'geometry' AS boundary
FROM
  temp_kelurahan;
```

### Importing School Data

You can import school data from a CSV file:

```sql
-- Create a temporary table to hold the CSV data
CREATE TEMP TABLE temp_schools (
  npsn VARCHAR(20),
  nama VARCHAR(255),
  alamat TEXT,
  kelurahan VARCHAR(255),
  bentuk_pendidikan VARCHAR(50),
  status VARCHAR(50),
  akreditasi VARCHAR(10),
  jumlah_siswa INTEGER,
  jumlah_guru INTEGER,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION
);

-- Import the CSV file
COPY temp_schools FROM '/path/to/schools.csv' WITH CSV HEADER;

-- Insert the data into the sekolah table
INSERT INTO sekolah (
  uuid, npsn, nama, alamat, kelurahan_id,
  bentuk_pendidikan, status, akreditasi,
  jumlah_siswa, jumlah_guru, lat, lng
)
SELECT
  gen_random_uuid() AS uuid,
  ts.npsn,
  ts.nama,
  ts.alamat,
  k.id AS kelurahan_id,
  ts.bentuk_pendidikan,
  ts.status,
  ts.akreditasi,
  ts.jumlah_siswa,
  ts.jumlah_guru,
  ts.lat,
  ts.lng
FROM
  temp_schools ts
LEFT JOIN
  kelurahan k ON ts.kelurahan = k.nama;
```

## Updating Spatial Data

If you need to update the GeoJSON representation after modifying geometries:

```sql
UPDATE kelurahan
SET boundary = ST_AsGeoJSON(geom)::jsonb
WHERE boundary IS NULL OR boundary::text = '';
```

## Querying Spatial Data

Example query to find schools within a specific kelurahan:

```sql
SELECT s.*
FROM sekolah s
JOIN kelurahan k ON s.kelurahan_id = k.id
WHERE k.nama = 'Medan Denai';
```

Example query to find schools within a certain distance of a point:

```sql
SELECT
  s.*,
  ST_Distance(
    ST_SetSRID(ST_MakePoint(s.lng, s.lat), 4326)::geography,
    ST_SetSRID(ST_MakePoint(98.6923, 3.5952), 4326)::geography
  ) AS distance_meters
FROM
  sekolah s
WHERE
  ST_DWithin(
    ST_SetSRID(ST_MakePoint(s.lng, s.lat), 4326)::geography,
    ST_SetSRID(ST_MakePoint(98.6923, 3.5952), 4326)::geography,
    1000  -- 1000 meters (1 km)
  )
ORDER BY
  distance_meters;
```

## Maintenance Tasks

### Creating an Index for Faster Spatial Queries

```sql
-- Index on the geometry column
CREATE INDEX idx_kelurahan_geom ON kelurahan USING GIST (geom);

-- Index on lat and lng columns
CREATE INDEX idx_sekolah_position ON sekolah USING GIST (
  ST_SetSRID(ST_MakePoint(lng, lat), 4326)
);

-- Index on foreign key
CREATE INDEX idx_sekolah_kelurahan ON sekolah (kelurahan_id);
```

### Backup and Restore

Backup the database:

```bash
pg_dump -d school_map_db -f backup.sql
```

Restore the database:

```bash
psql -d school_map_db -f backup.sql
```

## Troubleshooting

### Common Issues

1. **PostGIS Extension Not Found**

   If you encounter an error about the PostGIS extension, make sure it's installed:

   ```sql
   SELECT name, default_version FROM pg_available_extensions WHERE name = 'postgis';
   ```

   If not found, you may need to install PostGIS in your PostgreSQL installation.

2. **Coordinate System Issues**

   The app uses EPSG:4326 (WGS84) as the coordinate system. If your data is in a different system, you'll need to transform it:

   ```sql
   UPDATE kelurahan
   SET geom = ST_Transform(geom, 4326)
   WHERE ST_SRID(geom) != 4326;
   ```

3. **Invalid Geometry Errors**

   Fix invalid geometries:

   ```sql
   UPDATE kelurahan
   SET geom = ST_MakeValid(geom)
   WHERE NOT ST_IsValid(geom);
   ```

## Connection from the Application

The app connects to the database using the `node-postgres` library. The connection string is specified in the `.env.local` file:

```
DATABASE_URL=postgresql://username:password@localhost:5432/school_map_db
```

Make sure to replace `username` and `password` with your actual PostgreSQL credentials.
