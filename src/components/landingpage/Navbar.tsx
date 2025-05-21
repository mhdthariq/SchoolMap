import React, { useState, useEffect } from "react";
import Link from "next/link";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("beranda");

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Update active section based on scroll position
      const sections = ["beranda", "tentang", "sekolah", "tim"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          ? "bg-white/90 shadow-md backdrop-blur-md py-2"
          : "bg-white/80 backdrop-blur-sm shadow-sm py-4"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link
          href="/"
          className="flex items-center space-x-2 text-2xl font-bold"
        >
          <span className="text-indigo-600">📍</span>
          <span className="bg-gradient-to-r from-indigo-600 to-blue-600 text-transparent bg-clip-text">
            EduMap Medan Denai
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <a
            href="#beranda"
            className={`font-medium transition-colors ${
              isActive("beranda")
                ? "text-indigo-600"
                : "text-gray-700 hover:text-indigo-600"
            }`}
          >
            Beranda
          </a>
          <a
            href="#tentang"
            className={`font-medium transition-colors ${
              isActive("tentang")
                ? "text-indigo-600"
                : "text-gray-700 hover:text-indigo-600"
            }`}
          >
            Tentang
          </a>
          <a
            href="#sekolah"
            className={`font-medium transition-colors ${
              isActive("sekolah")
                ? "text-indigo-600"
                : "text-gray-700 hover:text-indigo-600"
            }`}
          >
            Sekolah Unggulan
          </a>
          <a
            href="#tim"
            className={`font-medium transition-colors ${
              isActive("tim")
                ? "text-indigo-600"
                : "text-gray-700 hover:text-indigo-600"
            }`}
          >
            Tim Kami
          </a>
        </nav>

        {/* Desktop CTA Button */}
        <Link
          href="/map"
          className="hidden md:inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-300"
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
          className="md:hidden text-gray-700 focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-indigo-600"
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
              className="h-6 w-6"
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
        className={`md:hidden absolute w-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? "max-h-80 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <nav className="flex flex-col px-6 py-3 space-y-3">
          <a
            href="#beranda"
            className={`py-2 border-b border-gray-100 font-medium ${
              isActive("beranda") ? "text-indigo-600" : "text-gray-700"
            }`}
            onClick={closeMenu}
          >
            Beranda
          </a>
          <a
            href="#tentang"
            className={`py-2 border-b border-gray-100 font-medium ${
              isActive("tentang") ? "text-indigo-600" : "text-gray-700"
            }`}
            onClick={closeMenu}
          >
            Tentang
          </a>
          <a
            href="#sekolah"
            className={`py-2 border-b border-gray-100 font-medium ${
              isActive("sekolah") ? "text-indigo-600" : "text-gray-700"
            }`}
            onClick={closeMenu}
          >
            Sekolah Unggulan
          </a>
          <a
            href="#tim"
            className={`py-2 border-b border-gray-100 font-medium ${
              isActive("tim") ? "text-indigo-600" : "text-gray-700"
            }`}
            onClick={closeMenu}
          >
            Tim Kami
          </a>
          <Link
            href="/map"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium text-center shadow-sm mt-2 flex items-center justify-center"
            onClick={closeMenu}
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
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
