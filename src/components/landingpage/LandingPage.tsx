import React, { useEffect } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import FeaturedSchoolsSection from "./FeaturedSchoolsSection";
import TeamSection from "./TeamSection";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

const LandingPage = () => {
  // Initialize AOS (Animate On Scroll) when component mounts
  useEffect(() => {
    // Import AOS dynamically to avoid SSR issues
    import("aos").then((module) => {
      const AOS = module.default || module;
      AOS.init({
        duration: 800,
        once: true,
      });
    });

    // Clean up AOS when component unmounts
    return () => {
      import("aos").then((module) => {
        const AOS = module.default || module;
        AOS.refresh();
      });
    };
  }, []);
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FeaturedSchoolsSection />
      <TeamSection />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default LandingPage;
