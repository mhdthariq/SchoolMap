import { useState } from "react";
import { Sekolah } from "@/types/school";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

interface SchoolSearchProps {
  data: Sekolah[];
  onSchoolSelect: (school: Sekolah) => void;
  onSearchReset: () => void;
}

export default function SchoolSearch({
  data,
  onSchoolSelect,
  onSearchReset,
}: SchoolSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSchools, setFilteredSchools] = useState<Sekolah[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const filtered = data.filter(
        (school) =>
          school.nama.toLowerCase().includes(query.toLowerCase()) ||
          school.alamat.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSchools(filtered);
      setShowResults(true);
    } else {
      setFilteredSchools([]);
      setShowResults(false);
      onSearchReset();
    }
  };

  const handleSchoolSelect = (school: Sekolah) => {
    setSearchQuery(school.nama);
    setShowResults(false);
    onSchoolSelect(school);
  };

  return (
    <div className="absolute top-5 left-5 z-[1000] w-full max-w-xl">
      <div className="relative group">
        {/* Search Input */}
        <div className="relative shadow-lg rounded-full bg-gradient-to-r from-white/70 to-white/30 backdrop-blur-lg border border-white/40 transition-all duration-300 hover:scale-[1.02]">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500 animate-pulse" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Cari sekolah berdasarkan nama atau alamat..."
            className="w-full pl-12 pr-12 py-3 rounded-full bg-transparent focus:outline-none text-[15px] text-gray-800 placeholder:text-gray-500"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-white/40 transition"
            >
              <IoClose className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Dropdown Result */}
        {showResults && filteredSchools.length > 0 && (
          <div
            className="absolute top-full left-0 right-0 mt-3 bg-white/80 backdrop-blur-md rounded-2xl 
              shadow-2xl border border-gray-200 max-h-80 overflow-y-auto divide-y divide-gray-100
              animate-in fade-in slide-in-from-top-2 duration-300"
          >
            {filteredSchools.map((school) => (
              <button
                key={school.uuid}
                onClick={() => handleSchoolSelect(school)}
                className="w-full px-5 py-3 text-left hover:bg-blue-100/40 transition-all group"
              >
                <div className="font-semibold text-base text-gray-800 group-hover:text-blue-700">
                  {school.nama}
                </div>
                <div className="text-sm text-gray-600 group-hover:text-gray-700 mt-1 flex items-center gap-2">
                  <FiSearch className="w-4 h-4 text-gray-400" />
                  {school.alamat}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
