import React from "react";
import Link from "next/link";
import { FaMapMarkerAlt, FaGithub, FaEnvelope, FaSchool } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gradient-to-b from-indigo-900 to-indigo-950 text-white pt-12 pb-6">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-between">
          {/* Logo and info */}
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <FaMapMarkerAlt className="text-blue-400 text-2xl mr-2" />
              <h3 className="text-xl font-bold">EduMap Medan Denai</h3>
            </div>
            <p className="text-gray-300 text-sm mb-4 max-w-md">
              Platform pemetaan sekolah interaktif yang menyajikan informasi
              lengkap tentang sekolah-sekolah di Kecamatan Medan Denai.
            </p>{" "}
            <div className="flex space-x-4">
              <a
                href="https://github.com/mhdthariq/school-map-app"
                className="text-blue-300 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="mailto:info@edumap.com"
                className="text-blue-300 hover:text-white transition-colors"
              >
                <FaEnvelope size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h4 className="text-lg font-semibold mb-4 text-blue-200">Tautan</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#beranda"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Beranda
                </a>
              </li>{" "}
              <li>
                <a
                  href="#tentang"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Tentang
                </a>
              </li>
              <li>
                <a
                  href="#sekolah"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Sekolah Unggulan
                </a>
              </li>
              <li>
                <a
                  href="#tim"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Tim Kami
                </a>
              </li>
            </ul>
          </div>

          {/* Access Map */}
          <div className="w-full md:w-1/4">
            <h4 className="text-lg font-semibold mb-4 text-blue-200">
              Peta Interaktif
            </h4>
            <p className="text-gray-300 text-sm mb-4">
              Akses peta interaktif lengkap dengan fitur pencarian dan navigasi
              rute untuk membantu Anda menemukan lokasi sekolah yang akurat.
            </p>
            <Link
              href="/map"
              className="flex items-center bg-gradient-to-r from-indigo-600 to-blue-600 hover:opacity-90 transition-all px-4 py-2 rounded-md w-fit shadow-md hover:shadow-lg"
            >
              <FaSchool className="mr-2" />
              <span>Buka Peta</span>
            </Link>
          </div>
        </div>{" "}
        <div className="border-t border-indigo-800 mt-8 pt-6 text-center">
          <p className="text-sm text-indigo-300">
            © {currentYear} EduMap Medan Denai. Dikembangkan oleh Mahasiswa
            Politeknik Negeri Medan
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
