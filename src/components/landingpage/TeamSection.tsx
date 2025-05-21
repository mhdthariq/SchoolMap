import React from "react";
import Image from "next/image";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

interface TeamMember {
  id: string;
  name: string;
  nim: string;
  role: string;
  image: string;
  bio?: string;
  links?: {
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    id: "jelita",
    name: "Grace Putri Jelita",
    nim: "2205181062",
    role: "Data Analyst",
    image: "/dashboard/team/jelita.jpg",
    bio: "Mahasiswa dengan keahlian dalam analisis data dan visualisasi informasi.",
    links: {
      linkedin: "https://linkedin.com/",
      github: "https://github.com/gracejelitaa",
      email: "mailto:waruwugraceputrijelita@gmail.com",
    },
  },
  {
    id: "dhandy",
    name: "Dhandy Bintang",
    nim: "2205181059",
    role: "Frontend Developer",
    image: "/dashboard/team/bintang.jpg",
    bio: "Ahli dalam pengembangan antarmuka pengguna dengan Tailwind CSS dan JavaScript.",
    links: {
      linkedin: "https://www.linkedin.com/in/dhandybintang",
      github: "https://github.com/dhandybintanghasibuan",
      email: "mailto:dhandybintang42@gmail.com",
    },
  },
  {
    id: "thariq",
    name: "Muhammad Thariq",
    nim: "2205181038",
    role: "Project Leader",
    image: "/dashboard/team/thariq.jpg",
    bio: "Pemimpin tim dengan visi dan kemampuan manajerial yang kuat.",
    links: {
      linkedin:
        "https://www.linkedin.com/in/muhammad-thariq-arya-putra-sembiring",
      github: "https://github.com/mhdthariq",
      email: "mailto:mthariqaryaputra1@gmail.com",
    },
  },
  {
    id: "hanif",
    name: "Hanif Almahmud",
    nim: "2205181009",
    role: "Data Analyst",
    image: "/dashboard/team/hanif.jpg",
    bio: "Analis data yang teliti dalam membaca pola data sekolah.",
    links: {
      linkedin: "https://www.linkedin.com/in/hanifalmahmudlubis/",
      github: "https://github.com/hanifalmahmudlubis",
      email: "mailto:hanifalmahmud2905@gmail.com",
    },
  },
  {
    id: "rista",
    name: "Rista Sirait",
    nim: "2205181016",
    role: "Data Analyst",
    image: "/dashboard/team/rista.jpg",
    bio: "Mahasiswa yang berdedikasi dalam analisis dan penyusunan data pendidikan.",
    links: {
      linkedin: "https://www.linkedin.com/in/rista-sirait-206730310/",
      github: "https://github.com/RistaSirait",
      email: "mailto:ristasirait054@gmail.com",
    },
  },
];

const TeamSection = () => {
  return (
    <section
      id="tim"
      className="py-20 bg-gradient-to-t from-indigo-50 to-white"
    >
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-indigo-900">
          Tim Kami
        </h2>
        <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
          Berikut adalah tim pengembang dari Website Pemetaan Sekolah di Kota
          Medan.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 justify-items-center">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl p-6 w-60 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-indigo-50"
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay={(teamMembers.indexOf(member) * 100).toString()}
            >
              <div className="mb-4 relative w-28 h-28 mx-auto group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex items-center justify-center z-10">
                  <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Detail
                  </span>
                </div>
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="rounded-full object-cover border-4 border-indigo-500"
                />{" "}
              </div>
              <h3 className="text-lg font-semibold text-indigo-900">
                {member.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1 mb-1">{member.nim}</p>
              <p className="text-sm font-medium text-blue-600 mb-2">
                {member.role}
              </p>

              {member.bio && (
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {member.bio}
                </p>
              )}

              {member.links && (
                <div className="flex space-x-3 justify-center">
                  {member.links.github && (
                    <a
                      href={member.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-indigo-800 transition-colors"
                    >
                      <FaGithub className="w-5 h-5" />
                    </a>
                  )}
                  {member.links.linkedin && (
                    <a
                      href={member.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <FaLinkedin className="w-5 h-5" />
                    </a>
                  )}
                  {member.links.email && (
                    <a
                      href={member.links.email}
                      className="text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                      <FaEnvelope className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
