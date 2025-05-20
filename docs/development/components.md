# Components Overview

This document provides a detailed overview of the component structure in the School Map App.

## Component Architecture

The application follows a modular component architecture, organized by functionality. Here's a breakdown of the main components and their responsibilities:

## Core Components

### `Map.tsx`

The central component that renders the interactive map. It's responsible for:

- Rendering the Leaflet map container
- Managing map layers and tile providers
- Handling map interactions
- Coordinating between other map-related components

```tsx
// src/components/map/Map.tsx
<MapContainer
  center={defaultCenter}
  zoom={13}
  scrollWheelZoom={true}
  zoomControl={false}
  maxZoom={19}
  minZoom={5}
  preferCanvas={true}
  tap={true}
  fadeAnimation={false}
  markerZoomAnimation={false}
  zoomAnimation={window.innerWidth > 768}
  style={{ height: "100%", width: "100%" }}
  className="z-0 [&_.leaflet-popup-content-wrapper]:bg-neutral-900/95 [&_.leaflet-popup-content-wrapper]:backdrop-blur-xl 
    [&_.leaflet-popup-content-wrapper]:text-white [&_.leaflet-popup-content-wrapper]:shadow-2xl 
    [&_.leaflet-popup-content-wrapper]:border [&_.leaflet-popup-content-wrapper]:border-neutral-800/50 
    [&_.leaflet-popup-tick]:bg-neutral-900/95"
  ref={(map) => {
    mapRef.current = map || null;
  }}
>
  <MapController map={mapRef.current} />
  <TileLayer
    url={MAP_LAYERS[activeMapLayer].url}
    attribution={MAP_LAYERS[activeMapLayer].attribution}
    {...getSubdomains(MAP_LAYERS[activeMapLayer])}
  />
  {data.filter(shouldShowSchool).map((sekolah) => (
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
  ))}
  <PolygonControl />
  <LocationControl onLocationUpdate={onUserLocationUpdate} />
  <RoutingControl
    userLocation={userLocation}
    schools={data}
    origin={routeOrigin}
    destination={routeDestination}
    onRouteInfoUpdate={onRouteInfoUpdate}
  />
  {/* Additional components... */}
</MapContainer>
```

### `Sidebar.tsx`

The main container for application controls and information displays:

- Contains tabs for different functionality (statistics, routing)
- Handles state for the active tab
- Adapts to mobile and desktop views

```tsx
// src/components/Sidebar.tsx
return (
  <div
    ref={sidebarRef}
    className={`fixed md:top-0 md:right-0 bottom-0 right-0 md:h-full h-[80vh] md:w-64 w-full 
    bg-white shadow-xl z-40 transform transition-transform duration-300 
    md:border-l border-t md:border-t-0 border-neutral-200 flex flex-col 
    md:rounded-none rounded-t-2xl ${
      isOpen
        ? "translate-y-0 md:translate-y-0 md:translate-x-0"
        : "translate-y-full md:translate-y-0 md:translate-x-full"
    }`}
    style={{ transform: isOpen ? `translateY(${dragY}px)` : undefined }}
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}
  >
    {/* Mobile drag handle indicator */}
    <div className="absolute top-2 left-0 right-0 flex justify-center md:hidden">
      <div className="w-10 h-1 bg-neutral-300 rounded-full"></div>
    </div>
    {/* Component content... */}
  </div>
);
```

### `MobileControls.tsx`

Provides optimized controls for mobile devices:

- Bottom navigation bar
- Top search bar
- Layer selection
- Touch-optimized interactions

```tsx
// src/components/mobile/MobileControls.tsx
return (
  <>
    {/* Top search bar for mobile - like Google Maps */}
    <div className="md:hidden fixed top-4 left-4 right-4 z-[1002]">
      <button
        onClick={() => setShowSearch(true)}
        className="w-full flex items-center gap-3 bg-white/95 backdrop-blur-md py-2.5 px-4 rounded-lg shadow-lg border border-neutral-200 text-left"
      >
        <FaSearch className="w-4 h-4 text-neutral-500" />
        <span className="text-sm text-neutral-500">Search for schools...</span>
      </button>
    </div>

    {/* Mobile Bottom Navigation Bar */}
    <div className="mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-[1001] border-t border-neutral-200 pb-safe">
      {/* Navigation controls... */}
    </div>

    {/* Mobile Search Panel */}
    {showSearch && (
      <div className="md:hidden fixed inset-x-0 top-0 bg-white z-[1002] animate-in slide-in-from-top duration-200 border-b border-neutral-200">
        {/* Search interface... */}
      </div>
    )}

    {/* Mobile Layer Selector */}
    {showLayerSelector && (
      <div
        className="md:hidden fixed inset-x-0 bottom-0 h-[70vh] bg-white z-[1002] animate-in slide-in-from-bottom duration-200 rounded-t-2xl shadow-lg"
        onTouchStart={handleLayerTouchStart}
        onTouchMove={handleLayerTouchMove}
        onTouchEnd={handleLayerTouchEnd}
        style={{ transform: `translateY(${layerDragY}px)` }}
      >
        {/* Layer selection interface... */}
      </div>
    )}
  </>
);
```

## Map Control Components

### `LayerSwitcher.tsx`

Handles switching between different map tile providers:

- Defines available map layers
- Provides UI for selecting layers
- Manages the active layer state

### `LocationControl.tsx`

Manages user location functionality:

- Finds and tracks user location
- Displays the location marker
- Handles location permissions

### `PolygonControl.tsx`

Manages administrative area polygons:

- Fetches and renders kelurahan boundaries
- Handles polygon interaction
- Manages polygon selection state

### `RoutingControl.tsx`

Provides routing functionality:

- Calculates routes between points
- Renders route lines on the map
- Generates navigation instructions

## UI Components

### `SchoolPopup.tsx`

Renders detailed information about a school when its marker is clicked:

- School name, address, and NPSN
- Accreditation status
- Student and teacher counts

### `SchoolSearch.tsx`

Provides search functionality for finding schools:

- Text-based search interface
- Real-time filtering
- Search result display

### `SchoolStatistic.tsx`

Displays statistical information about schools:

- Count by school type
- Distribution across administrative areas
- Interactive filtering

## Context Providers

### `LocationContext.tsx`

Provides location data and functionality throughout the application:

- Shares user location between components
- Manages location persistence
- Handles location updates

## Component Relationships

The components are organized in a hierarchical structure:

1. **Page Component** (`page.tsx`) - The entry point that orchestrates all components
2. **Map Component** (`Map.tsx`) - The primary visualization container
3. **Control Components** - Specialized components for specific map functionality
4. **UI Components** - User interface elements for interaction
5. **Mobile-specific Components** - Optimized controls for mobile devices

This modular architecture allows for:

- Independent development of features
- Easier testing and maintenance
- Better performance through optimized rendering
- Responsive design for different screen sizes
