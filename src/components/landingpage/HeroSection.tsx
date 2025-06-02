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
          strings: [
            "Pemetaan Sekolah Di Kecamatan Medan Denai",
            "Temukan Sekolah Terbaik Di Medan Denai",
            "Informasi Lengkap Sekolah Di Medan Denai",
          ],
          typeSpeed: 60,
          backSpeed: 40,
          backDelay: 3000,
          startDelay: 500,
          loop: true,
          showCursor: true,
          cursorChar: "|",
          smartBackspace: true,
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
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-white to-indigo-50"
    >
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed z-0 transform scale-105"
        style={{ backgroundImage: "url('/dashboard/map-medan.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/40 to-blue-500/30 backdrop-blur-[1px]"></div>
        {/* Add subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      {/* Animated floating shapes for visual interest */}
      <div className="absolute w-72 h-72 rounded-full bg-indigo-500/10 top-20 right-1/4 backdrop-blur-3xl animate-float"></div>
      <div className="absolute w-56 h-56 rounded-full bg-blue-500/10 bottom-20 left-1/4 backdrop-blur-3xl animate-float-delayed"></div>
      <div className="absolute w-32 h-32 rounded-full bg-purple-500/10 top-40 left-1/5 backdrop-blur-2xl animate-float-slow"></div>
      <div className="absolute w-24 h-24 rounded-full bg-indigo-400/10 bottom-40 right-1/3 backdrop-blur-xl animate-pulse"></div>

      {/* Content */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="max-w-2xl" data-aos="fade-right">
          <span className="inline-block px-4 py-1.5 bg-indigo-500 rounded-full text-white text-sm font-medium mb-6 animate-pulse shadow-lg shadow-indigo-500/10">
            Solusi Interaktif Pencarian Sekolah
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-indigo-900 mb-6 leading-tight tracking-tight">
            <span ref={titleRef}></span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed max-w-xl">
            Temukan lokasi dan informasi lengkap tentang sekolah-sekolah di
            Kecamatan Medan Denai secara cepat, mudah, dan interaktif.
          </p>
          <div className="flex flex-col sm:flex-row gap-5">
            <Link
              href="/map"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-white bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1.5 hover:shadow-xl shadow-md transition-all duration-300 transform"
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
                ></path>
              </svg>
              Lihat Peta Sekolah
            </Link>
            <a
              href="#sekolah"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-indigo-600 bg-white border border-indigo-200 hover:bg-indigo-50 hover:-translate-y-1.5 hover:shadow-lg shadow-sm transition-all duration-300 transform"
            >
              Sekolah Unggulan
              <svg
                className="w-5 h-5 ml-3"
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
        className="hidden lg:block absolute right-20 bottom-20 bg-white p-6 rounded-3xl shadow-lg border border-gray-100 transform rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500"
        data-aos="fade-up"
      >
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-indigo-500 opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-blue-500 opacity-20 animate-float-slow"></div>

          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-4 bg-indigo-50 rounded-xl border border-indigo-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-200/30">
              <div className="counter-wrapper">
                <h3 className="text-4xl font-bold text-indigo-700 mb-1 flex justify-center items-baseline">
                  <span className="animate-count-up" data-count="100">
                    100
                  </span>
                  <span className="text-indigo-500">+</span>
                </h3>
              </div>
              <p className="text-indigo-600 font-medium">Sekolah</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-200/30">
              <div className="counter-wrapper">
                <h3 className="text-4xl font-bold text-blue-700 mb-1 flex justify-center items-baseline">
                  <span className="animate-count-up" data-count="3">
                    3
                  </span>
                  <span className="text-blue-500">+</span>
                </h3>
              </div>
              <p className="text-blue-600 font-medium">Jenjang</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll down indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 hidden md:block">
        <a
          href="#tentang"
          className="flex flex-col items-center text-indigo-700 hover:text-indigo-800 transition-colors duration-300"
        >
          <span className="text-sm font-medium mb-2">Scroll Down</span>
          <div className="w-6 h-10 border-2 border-indigo-400 rounded-full flex justify-center pt-1">
            <div className="w-1.5 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
          </div>
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
