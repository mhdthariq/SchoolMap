import React, { useEffect, useRef } from "react";
import Link from "next/link";

const HeroSection = () => {
  const titleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Initialize typed.js
    if (typeof window !== "undefined" && titleRef.current) {
      // Dynamic import for typed.js
      import("typed.js").then(({ default: Typed }) => {
        const typed = new Typed(titleRef.current!, {
          strings: ["Pemetaan Sekolah Di Kecamatan Medan Denai"],
          typeSpeed: 50,
          backSpeed: 30,
          loop: false,
          showCursor: true,
        });

        // Clean up
        return () => {
          typed.destroy();
        };
      });
    }
  }, []);

  return (
    <section
      id="beranda"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed z-0 transform scale-105"
        style={{ backgroundImage: "url('/dashboard/map-medan.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/70 to-blue-900/50 backdrop-blur-[3px]"></div>
      </div>

      {/* Floating elements for visual interest */}
      <div className="absolute w-64 h-64 rounded-full bg-indigo-500/10 top-20 right-1/4 backdrop-blur-3xl animate-float"></div>
      <div className="absolute w-48 h-48 rounded-full bg-blue-500/10 bottom-20 left-1/4 backdrop-blur-3xl animate-float-delayed"></div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="max-w-2xl" data-aos="fade-right">
          <span className="inline-block px-3 py-1 bg-indigo-500/20 backdrop-blur-md rounded-full text-white text-sm font-medium mb-6 animate-pulse">
            Solusi Interaktif Pencarian Sekolah
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            <span ref={titleRef}></span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 mb-10 leading-relaxed max-w-xl">
            Temukan lokasi dan informasi lengkap tentang sekolah-sekolah di
            Kecamatan Medan Denai secara cepat, mudah, dan interaktif.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/map"
              className="inline-flex items-center px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 hover:-translate-y-1 hover:shadow-xl shadow-indigo-500/20 transition-all duration-300 transform"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                ></path>
              </svg>
              Lihat Peta Sekolah
            </Link>
            <a
              href="#sekolah"
              className="inline-flex items-center px-8 py-4 rounded-full font-bold text-indigo-700 bg-white hover:bg-indigo-50 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 transform"
            >
              Sekolah Unggulan
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Floating card with stats */}
      <div
        className="hidden lg:block absolute right-20 bottom-20 bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 transform rotate-3 hover:rotate-0 transition-transform duration-300"
        data-aos="fade-up"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3">
            <h3 className="text-3xl font-bold text-white">100+</h3>
            <p className="text-indigo-200 text-sm">Sekolah</p>
          </div>
          <div className="text-center p-3">
            <h3 className="text-3xl font-bold text-white">3</h3>
            <p className="text-indigo-200 text-sm">Jenjang</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
