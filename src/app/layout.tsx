import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Remove duplicate import since it's already imported in Map component
// import "leaflet/dist/leaflet.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Default metadata (will be overridden by page-specific metadata)
export const metadata: Metadata = {
  title: {
    template: "%s | EduMap Medan Denai",
    default: "EduMap Medan Denai - Pemetaan Sekolah",
  },
  description:
    "Informasi dan pemetaan sekolah di Kecamatan Medan Denai secara interaktif",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {" "}
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        {/* Add the Leaflet Routing Machine CSS */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css"
          crossOrigin=""
        />
        {/* Google Font from the original landing page */}
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap"
          rel="stylesheet"
        />
        {/* Typed.js for hero section text animation */}
        <script
          src="https://cdn.jsdelivr.net/npm/typed.js@2.0.12"
          async
        ></script>
        {/* AOS library for scroll animations */}
        <script src="https://unpkg.com/aos@2.3.1/dist/aos.js" async></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
