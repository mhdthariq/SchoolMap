# School Map App

A comprehensive web application for visualizing and interacting with school data on a map. This application allows users to view school locations, access detailed information about each school, get directions to schools, and analyze school distribution statistics across different administrative areas.

## Features

- **Interactive School Map**: View all schools on a dynamic, interactive map with custom markers for different school types (SD, SMP, SMA)
- **School Search**: Find schools by name or address with real-time filtering
- **Detailed School Information**: View comprehensive details about each school including:
  - Name, NPSN (National School ID), and address
  - Accreditation status with color-coding
  - School type (SD/SMP/SMA)
  - Number of teachers and students
- **Navigation Features**:
  - Get directions from your current location to any school
  - Calculate routes between schools
  - View detailed step-by-step navigation instructions
  - Distance and estimated travel time calculations
- **Current Location**: Find and use your current location for navigation
- **Statistical Analysis**:
  - View school distribution statistics by kelurahan (administrative area)
  - Filter schools by type (SD, SMP, SMA)
  - Analyze school density across different regions
- **Multiple Map Layers**: Switch between different map styles and providers
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**:

  - Next.js 14 (React framework)
  - TypeScript for type safety
  - Tailwind CSS for styling
  - Leaflet.js for mapping
  - Leaflet Routing Machine for navigation features
  - React Icons for UI elements

- **Backend**:
  - Next.js API routes
  - PostgreSQL with PostGIS for spatial data
  - Node-Postgres (pg) for database connectivity

## Getting Started

### Prerequisites

- Node.js 18.0 or later, or Bun 1.0 or later
- PostgreSQL with PostGIS extension
- A database with school data in the required format (see below)

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/school_map_db
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/mhdthariq/SchoolMap.git
cd SchoolMap
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Database Schema

The application expects the following tables in your PostgreSQL database:

1. `sekolah` - Contains school information
2. `kelurahan` - Contains administrative area information

## Documentation

Comprehensive documentation is available in the `docs` directory:

- [Documentation Home](./docs/README.md)

### Feature Documentation

- [Maps and Points](./docs/features/maps-and-points.md) - How to display school points
- [Polygons](./docs/features/polygons.md) - How to display administrative area polygons

### Developer Documentation

- [Components Overview](./docs/development/components.md) - Understanding the component structure
- [Data Flow](./docs/development/data-flow.md) - How data moves through the application
- [Database Setup](./docs/development/database-setup.md) - Setting up the database
- [TypeScript Types](./docs/development/typescript-types.md) - TypeScript type system
- [Implementing Features](./docs/development/implementing-features.md) - Feature implementation patterns

### API Documentation

- [API Overview](./docs/api/overview.md) - Overview of the API endpoints
- [School API](./docs/api/endpoints/sekolah.md) - School data API
- [Administrative Areas API](./docs/api/endpoints/kelurahan.md) - Geographic boundaries API
- [Statistics API](./docs/api/endpoints/kelurahan-stats.md) - School statistics API
- [Location API](./docs/api/endpoints/location.md) - User location API

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Leaflet.js for the amazing mapping capabilities
- Next.js team for the powerful React framework
- All contributors and users of this application
