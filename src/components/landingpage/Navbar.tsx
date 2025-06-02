import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("beranda");
  const navRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  // Update active indicator position
  useEffect(() => {
    if (navRef.current && indicatorRef.current) {
      const activeNavItem = navRef.current.querySelector(
        `[href="#${activeSection}"]`
      );
      if (activeNavItem) {
        const rect = activeNavItem.getBoundingClientRect();
        const navRect = navRef.current.getBoundingClientRect();

        indicatorRef.current.style.width = `${rect.width}px`;
        indicatorRef.current.style.left = `${rect.left - navRect.left}px`;
        indicatorRef.current.style.opacity = "1";
      }
    }
  }, [activeSection, scrolled]);

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      // Smooth transition for navbar background
      const scrollThreshold = 50;
      if (window.scrollY > scrollThreshold) {
        if (!scrolled) setScrolled(true);
      } else {
        if (scrolled) setScrolled(false);
      }

      // Update active section based on scroll position with improved detection
      const sections = ["beranda", "tentang", "sekolah", "tim"];
      let closestSection = null;
      let closestDistance = Number.MAX_VALUE;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const distance = Math.abs(rect.top);

          // Find the section closest to the viewport top
          if (distance < closestDistance && rect.bottom > 0) {
            closestDistance = distance;
            closestSection = section;
          }
        }
      }

      if (closestSection && closestSection !== activeSection) {
        setActiveSection(closestSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection, scrolled]);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (section: string) => {
    return activeSection === section;
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md py-2"
          : "bg-white/90 backdrop-blur-md py-4 shadow-sm"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link
          href="/"
          className="flex items-center space-x-2 text-2xl font-bold group"
        >
          <div className="relative">
            <span className="text-indigo-600 group-hover:scale-110 transition-transform duration-300 text-3xl">
              📍
            </span>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          </div>
          <span className="bg-gradient-to-r from-indigo-700 to-blue-600 text-transparent bg-clip-text group-hover:from-indigo-600 group-hover:to-blue-500 transition-colors duration-300">
            EduMap Medan Denai
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav ref={navRef} className="hidden md:flex space-x-8 relative">
          <a
            href="#beranda"
            className={`font-medium transition-all duration-300 relative py-1.5 px-2 ${
              isActive("beranda")
                ? "text-indigo-600"
                : "text-gray-700 hover:text-indigo-600"
            } hover:bg-indigo-50 rounded-md`}
          >
            <span className="relative z-10">Beranda</span>
            {isActive("beranda") && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full"></span>
            )}
          </a>
          <a
            href="#tentang"
            className={`font-medium transition-all duration-300 relative py-1.5 px-2 ${
              isActive("tentang")
                ? "text-indigo-600"
                : "text-gray-700 hover:text-indigo-600"
            } hover:bg-indigo-50 rounded-md`}
          >
            <span className="relative z-10">Tentang</span>
            {isActive("tentang") && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full"></span>
            )}
          </a>
          <a
            href="#sekolah"
            className={`font-medium transition-all duration-300 relative py-1.5 px-2 ${
              isActive("sekolah")
                ? "text-indigo-600"
                : "text-gray-700 hover:text-indigo-600"
            } hover:bg-indigo-50 rounded-md`}
          >
            <span className="relative z-10">Sekolah Unggulan</span>
            {isActive("sekolah") && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full"></span>
            )}
          </a>
          <a
            href="#tim"
            className={`font-medium transition-all duration-300 relative py-1.5 px-2 ${
              isActive("tim")
                ? "text-indigo-600"
                : "text-gray-700 hover:text-indigo-600"
            } hover:bg-indigo-50 rounded-md`}
          >
            <span className="relative z-10">Tim Kami</span>
            {isActive("tim") && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full"></span>
            )}
          </a>

          {/* Active indicator */}
          <div
            ref={indicatorRef}
            className="absolute bottom-0 left-0 h-0.5 bg-indigo-600 rounded-full transition-all duration-300"
            style={{ width: "auto", opacity: 0 }}
          ></div>
        </nav>

        {/* Desktop CTA Button */}
        <Link
          href="/map"
          className="hidden md:inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          Lihat Peta
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className={`md:hidden focus:outline-none p-2 rounded-full transition-all duration-300 bg-indigo-50 hover:bg-indigo-100`}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      <div
        className={`md:hidden absolute w-full bg-white shadow-lg transition-all duration-500 ease-in-out ${
          mobileMenuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <nav className="flex flex-col px-6 py-4 space-y-4">
          <a
            href="#beranda"
            className={`py-3 px-4 rounded-lg font-medium transition-all duration-300 relative overflow-hidden ${
              isActive("beranda")
                ? "text-white bg-indigo-600 shadow-sm"
                : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
            }`}
            onClick={closeMenu}
          >
            <span className="relative z-10">Beranda</span>
            {isActive("beranda") && (
              <span className="absolute inset-0 bg-indigo-100/50"></span>
            )}
          </a>
          <a
            href="#tentang"
            className={`py-3 px-4 rounded-lg font-medium transition-all duration-300 relative overflow-hidden ${
              isActive("tentang")
                ? "text-white bg-indigo-600 shadow-sm"
                : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
            }`}
            onClick={closeMenu}
          >
            <span className="relative z-10">Tentang</span>
            {isActive("tentang") && (
              <span className="absolute inset-0 bg-indigo-100/50"></span>
            )}
          </a>
          <a
            href="#sekolah"
            className={`py-3 px-4 rounded-lg font-medium transition-all duration-300 relative overflow-hidden ${
              isActive("sekolah")
                ? "text-white bg-indigo-600 shadow-sm"
                : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
            }`}
            onClick={closeMenu}
          >
            <span className="relative z-10">Sekolah Unggulan</span>
            {isActive("sekolah") && (
              <span className="absolute inset-0 bg-indigo-100/50"></span>
            )}
          </a>
          <a
            href="#tim"
            className={`py-3 px-4 rounded-lg font-medium transition-all duration-300 relative overflow-hidden ${
              isActive("tim")
                ? "text-white bg-indigo-600 shadow-sm"
                : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
            }`}
            onClick={closeMenu}
          >
            <span className="relative z-10">Tim Kami</span>
            {isActive("tim") && (
              <span className="absolute inset-0 bg-indigo-100/50"></span>
            )}
          </a>
          <Link
            href="/map"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3.5 rounded-full font-medium text-center shadow-md hover:shadow-lg mt-2 flex items-center justify-center transition-all duration-300 transform hover:scale-105"
            onClick={closeMenu}
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            Lihat Peta Sekolah
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
