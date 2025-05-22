# UI Components Documentation

This document details the UI components and design choices in the School Map App.

## Favicon System

The School Map App uses a comprehensive favicon system to ensure compatibility across all browsers and platforms, including Linux.

### Favicon Files

The following favicon files are included in the `public` directory:

| File                       | Size     | Purpose                                |
| -------------------------- | -------- | -------------------------------------- |
| favicon.ico                | 32x32    | Traditional favicon for older browsers |
| favicon-16x16.png          | 16x16    | Small favicon for modern browsers      |
| favicon-32x32.png          | 32x32    | Standard favicon for modern browsers   |
| apple-touch-icon.png       | 180x180  | Icon for iOS devices                   |
| android-chrome-192x192.png | 192x192  | Icon for Android devices               |
| android-chrome-512x512.png | 512x512  | Large icon for Android devices         |
| favicon.svg                | Scalable | Vector source for favicon generation   |
| safari-pinned-tab.svg      | Scalable | Icon for Safari pinned tabs            |
| site.webmanifest           | -        | Web app manifest file                  |

### Implementation

The favicon system is implemented in several parts:

1. **HTML Head** (`src/app/layout.tsx`):

   ```tsx
   <link rel="icon" href="/favicon.ico" sizes="any" />
   <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
   <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
   <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
   <link rel="manifest" href="/site.webmanifest" />
   <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#4f46e5" />
   ```

2. **Next.js Configuration** (`next.config.ts`):

   ```typescript
   webpack: (config) => {
     config.module.rules.push({
       test: /\.(ico|png|svg)$/,
       type: 'asset/resource',
       generator: {
         filename: 'static/media/[name].[hash][ext]'
       }
     });
     return config;
   },
   headers: async () => {
     return [
       {
         source: '/favicon.ico',
         headers: [
           {
             key: 'Cache-Control',
             value: 'public, max-age=31536000, immutable',
           },
           {
             key: 'Content-Type',
             value: 'image/x-icon',
           },
         ],
       },
       // Additional headers...
     ];
   }
   ```

3. **Web App Manifest** (`public/site.webmanifest`):

   ```json
   {
     "name": "EduMap Medan Denai",
     "short_name": "EduMap",
     "icons": [
       {
         "src": "/favicon-16x16.png",
         "sizes": "16x16",
         "type": "image/png"
       }
       // Additional icon definitions...
     ],
     "theme_color": "#4f46e5",
     "background_color": "#ffffff",
     "display": "standalone"
   }
   ```

4. **Favicon Generation** (`generate-favicons.js`):
   A script to generate all favicon files from a single source SVG.

### Browser Compatibility

This favicon system ensures compatibility with:

- Modern browsers (Chrome, Firefox, Edge, Safari)
- Mobile browsers (iOS Safari, Android Chrome)
- Linux-based browsers
- Progressive Web App installations
- Browser bookmarks and favorites

## Filter Buttons

The application uses styled filter buttons in the Featured Schools Section to allow filtering of schools by type (SD, SMP, SMA).

### Implementation

Filter buttons are implemented in `src/components/landingpage/FeaturedSchoolsSection.tsx`:

```tsx
<button
  onClick={() => setSelectedType("ALL")}
  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
    selectedType === "ALL"
      ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-200/50"
      : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 shadow hover:shadow-indigo-100 border border-gray-100"
  }`}
>
  Semua
</button>
```

### Color Scheme

Each school type has a distinct color scheme:

- **SD (Elementary)**: Green to emerald gradient
- **SMP (Junior High)**: Blue to sky gradient
- **SMA (Senior High)**: Indigo to violet gradient
- **All Schools**: Indigo to blue gradient

### Filter Logic

Filtering is implemented using string includes method to match partial school type strings:

```typescript
setFilteredSchools(
  schools.filter((school) => {
    if (selectedType === "SD") {
      return school.bentuk_pendidikan.includes("SD");
    } else if (selectedType === "SMP") {
      return school.bentuk_pendidikan.includes("SMP");
    } else if (selectedType === "SMA") {
      return school.bentuk_pendidikan.includes("SMA");
    }
    return false;
  })
);
```

## School Type Visual Indicators

School types are visually distinguished using the `SchoolImage` component (`src/components/landingpage/SchoolImage.tsx`).

### Color Scheme

- **SD (Elementary)**: Green to emerald gradient

  ```tsx
  bgGradient = "bg-gradient-to-br from-green-200 to-emerald-300";
  textColor = "text-green-800";
  ```

- **SMP (Junior High)**: Blue to sky gradient

  ```tsx
  bgGradient = "bg-gradient-to-br from-blue-200 to-sky-300";
  textColor = "text-blue-800";
  ```

- **SMA (Senior High)**: Indigo to violet gradient
  ```tsx
  bgGradient = "bg-gradient-to-br from-indigo-200 to-violet-300";
  textColor = "text-indigo-900";
  ```

### Decorative Elements

Each school image includes decorative elements to enhance visual appeal:

```tsx
<div className="absolute w-32 h-32 rounded-full bg-white/20 -top-10 -right-10"></div>
<div className="absolute w-32 h-32 rounded-full bg-white/15 bottom-10 -left-10"></div>
<div className="absolute w-16 h-16 rounded-full bg-white/15 top-20 left-5"></div>
<div className="absolute w-12 h-12 rounded-full bg-white/15 bottom-5 right-10"></div>
```

## Design Guidelines

The application follows these design principles:

1. **Color Consistency**: Using indigo/blue as the primary color scheme
2. **Visual Hierarchy**: Important elements stand out through color and size
3. **Responsive Design**: UI adapts to different screen sizes
4. **Visual Feedback**: Interactive elements provide visual feedback
5. **Accessibility**: Sufficient color contrast for readability
