"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

// Import LandingPage dynamically
const LandingPage = dynamic(
  () => import("@/components/landingpage/LandingPage"),
  {
    ssr: true,
  }
);

export default function HomePage() {
  // Load AOS (Animate On Scroll) library CSS
  useEffect(() => {
    import("aos/dist/aos.css");
  }, []);
  return <LandingPage />;
}
