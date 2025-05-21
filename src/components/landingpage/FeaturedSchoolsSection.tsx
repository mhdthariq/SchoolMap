import React, { useEffect, useState } from "react";
import SchoolImage from "./SchoolImage";
import Link from "next/link";

interface School {
  uuid: string;
  nama: string;
  alamat: string;
  status: string;
  bentuk_pendidikan: string;
  akreditasi: string;
  lng?: number;
  lat?: number;
}

const FeaturedSchoolsSection = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [schoolTypes, setSchoolTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchFeaturedSchools = async () => {
      try {
        const response = await fetch("/api/sekolah-unggulan");
        if (!response.ok) {
          throw new Error("Failed to fetch featured schools");
        }
        const data = await response.json();
        setSchools(data);
        setFilteredSchools(data);
        // Extract unique school types
        const types = Array.from(
          new Set(data.map((school: School) => school.bentuk_pendidikan))
        ) as string[];
        setSchoolTypes(types);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error fetching featured schools:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedSchools();
  }, []);
  // Filter schools by type
  useEffect(() => {
    if (selectedType === "ALL") {
      setFilteredSchools(schools);
    } else {
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
    }
  }, [selectedType, schools]);

  // Skeleton loading component
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-indigo-50 h-[380px]">
      <div className="h-48 bg-gray-200 animate-pulse"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
        <div className="flex space-x-2 mb-3">
          <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-5 w-24 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );

  return (
    <section
      id="sekolah"
      className="py-24 bg-gradient-to-br from-indigo-50 via-white to-blue-50 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>
      <div className="absolute w-96 h-96 bg-indigo-100 rounded-full -top-48 -left-48 opacity-70"></div>
      <div className="absolute w-96 h-96 bg-blue-100 rounded-full -bottom-48 -right-48 opacity-70"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto" data-aos="fade-up">
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-3">
            Sekolah Terakreditasi A
          </span>{" "}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-indigo-900 leading-tight">
            Sekolah Unggulan{" "}
            <span className="text-gradient">SD, SMP, dan SMA</span>
          </h2>
          <p className="text-gray-600 text-lg mb-16 max-w-2xl mx-auto">
            Temukan sekolah terakreditasi A di Kecamatan Medan Denai yang siap
            membantu Anda meraih prestasi pendidikan terbaik.
          </p>
        </div>{" "}
        {/* Filter options */}
        {!loading && !error && (
          <div
            className="flex flex-wrap justify-center gap-3 mb-16"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {" "}
            <button
              onClick={() => setSelectedType("ALL")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedType === "ALL"
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-200"
                  : "bg-white text-gray-700 hover:bg-gray-50 hover:text-indigo-700 shadow-md border border-gray-100"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setSelectedType("SD")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedType === "SD"
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-200"
                  : "bg-white text-gray-700 hover:bg-gray-50 hover:text-indigo-700 shadow-md border border-gray-100"
              }`}
            >
              SD
            </button>
            <button
              onClick={() => setSelectedType("SMP")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedType === "SMP"
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-200"
                  : "bg-white text-gray-700 hover:bg-gray-50 hover:text-indigo-700 shadow-md border border-gray-100"
              }`}
            >
              SMP
            </button>
            <button
              onClick={() => setSelectedType("SMA")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedType === "SMA"
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-200"
                  : "bg-white text-gray-700 hover:bg-gray-50 hover:text-indigo-700 shadow-md border border-gray-100"
              }`}
            >
              SMA
            </button>
          </div>
        )}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <SkeletonCard />
              </div>
            ))}
          </div>
        )}
        {error && (
          <div
            className="text-red-500 mb-8 p-6 bg-red-50 rounded-xl shadow-sm border border-red-100 max-w-2xl mx-auto"
            data-aos="fade-up"
          >
            <svg
              className="w-12 h-12 text-red-400 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <p className="font-medium text-lg text-center">
              Gagal memuat sekolah:
            </p>
            <p className="text-center">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 w-full text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}
        {!loading && !error && filteredSchools.length === 0 && (
          <div
            className="text-gray-500 mb-8 p-10 bg-white rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto"
            data-aos="fade-up"
          >
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xl font-medium text-center">
              Tidak ada sekolah ditemukan
            </p>
            <p className="mt-2 text-center">
              Coba pilih kategori lain atau lihat semua sekolah
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSchools.map((school, index) => (
            <div
              key={school.uuid}
              className="card-hover bg-white rounded-2xl overflow-hidden shadow-lg border border-indigo-50"
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              <div className="h-48 relative">
                <SchoolImage
                  schoolType={school.bentuk_pendidikan}
                  className="h-full w-full"
                />
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
                    <span className="mr-1 h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
                    Akreditasi {school.akreditasi}
                  </span>
                </div>
              </div>
              <div className="p-6 text-left">
                <h3 className="text-xl font-semibold mb-2 text-indigo-900 line-clamp-2 hover:text-indigo-700 transition-colors">
                  {school.nama}
                </h3>
                <div className="flex items-center flex-wrap gap-2 mb-3">
                  <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {school.bentuk_pendidikan}
                  </span>
                  <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {school.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {school.alamat}
                </p>
                <Link
                  href={`/map?schoolId=${school.uuid}&lat=${school.lat}&lng=${school.lng}`}
                  className="inline-flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl hover:from-indigo-700 hover:to-blue-700 shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
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
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  Lihat di Peta
                </Link>
              </div>
            </div>
          ))}
        </div>
        {!loading && !error && schools.length > 0 && (
          <div className="mt-16 text-center" data-aos="fade-up">
            <Link
              href="/map"
              className="inline-flex items-center px-8 py-4 text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:-translate-y-1"
            >
              Lihat Semua Sekolah
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedSchoolsSection;
