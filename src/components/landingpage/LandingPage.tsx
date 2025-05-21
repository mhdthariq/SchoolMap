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
    const AOS = require("aos");
    AOS.init({
      duration: 800,
      once: true,
    });

    // Clean up AOS when component unmounts
    return () => {
      AOS.refresh();
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
