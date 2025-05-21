import React from "react";

const AboutSection = () => {
  return (
    <section
      id="tentang"
      className="py-24 bg-gradient-to-b from-white to-indigo-50 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute w-80 h-80 rounded-full bg-indigo-100/50 -top-40 -right-20 animate-float"></div>
      <div className="absolute w-64 h-64 rounded-full bg-blue-100/50 bottom-20 -left-20 animate-float-delayed"></div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="mb-16" data-aos="fade-up">
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-3">
            Tentang Kami
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-indigo-900">
            Memperkenalkan <span className="text-gradient">Platform Kami</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="lg:order-2" data-aos="fade-left">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-600 rounded-3xl transform rotate-3"></div>
              <div className="relative overflow-hidden rounded-2xl shadow-xl border-8 border-white">
                <img
                  src="/dashboard/point-polygon.png"
                  alt="Peta Kecamatan Medan Denai"
                  className="w-full h-auto transform hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          <div className="text-left lg:order-1" data-aos="fade-right">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-indigo-100">
              <p className="mb-4 text-gray-700 leading-relaxed">
                Website{" "}
                <strong className="text-indigo-700 font-semibold">
                  Pemetaan Sekolah Di Kecamatan Medan Denai
                </strong>{" "}
                ini dikembangkan oleh mahasiswa Politeknik Negeri Medan dengan
                tujuan utama untuk mempermudah masyarakat dalam mencari
                informasi sekolah secara akurat, cepat, dan interaktif.
              </p>{" "}
              <p className="mb-4 text-gray-700 leading-relaxed">
                Melalui platform ini, kami menyajikan peta lokasi sekolah,
                jenjang pendidikan, hingga informasi terkait fasilitas, program
                unggulan, dan aksesibilitas masing-masing sekolah.
              </p>
              <p className="mb-4 text-gray-700 leading-relaxed">
                Dengan desain yang modern, user-friendly, dan responsif, kami
                berharap website ini dapat menjadi solusi inovatif bagi para
                orang tua, siswa, maupun masyarakat umum dalam menentukan
                pilihan sekolah terbaik di Kota Medan.
              </p>
              <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl">
                <p className="font-semibold text-indigo-800 text-xl leading-relaxed italic">
                  "Karena pendidikan yang berkualitas berawal dari akses
                  informasi yang tepat."
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center bg-indigo-50 p-3 rounded-xl">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-100">
                    <svg
                      className="w-6 h-6 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-indigo-900">
                      Berbasis Lokasi
                    </h3>
                    <p className="text-sm text-gray-600">
                      Pemetaan terintegrasi
                    </p>
                  </div>
                </div>

                <div className="flex items-center bg-indigo-50 p-3 rounded-xl">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-100">
                    <svg
                      className="w-6 h-6 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      ></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-indigo-900">Data Akurat</h3>
                    <p className="text-sm text-gray-600">
                      Informasi terpercaya
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
