import { useState } from "react";
import { Sekolah } from "@/types/school";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

interface SchoolSearchProps {
  data: Sekolah[];
  onSchoolSelect: (school: Sekolah) => void;
  onSearchReset: () => void; // Add this prop
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
    try {
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
    } catch (error) {
      console.error("Error during search:", error);
      setFilteredSchools([]);
      setShowResults(false);
    }
  };

  const handleSchoolSelect = (school: Sekolah) => {
    setSearchQuery(school.nama);
    setShowResults(false);
    onSchoolSelect(school);
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] w-96">
      <div className="relative">
        <div className="relative group">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400/80 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Cari sekolah berdasarkan nama atau alamat"
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white shadow-lg focus:outline-none focus:ring-2 
              focus:ring-blue-500/20 focus:border-transparent placeholder:text-neutral-500 text-neutral-700
              border-0"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 
                transition-colors p-1 rounded-full hover:bg-neutral-100"
            >
              <IoClose className="w-4 h-4" />
            </button>
          )}
        </div>
        {showResults && filteredSchools.length > 0 && (
          <div
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl 
            shadow-lg border border-neutral-200/80 max-h-[320px] overflow-y-auto divide-y divide-neutral-100
            animate-in fade-in slide-in-from-top-2 duration-200"
          >
            {filteredSchools.map((school) => (
              <button
                key={school.uuid} // Changed from school.id
                onClick={() => handleSchoolSelect(school)}
                className="w-full px-5 py-3.5 text-left hover:bg-blue-50/50 transition-colors group"
              >
                <div className="font-medium text-[15px] text-neutral-800 group-hover:text-blue-700">
                  {school.nama}
                </div>
                <div className="text-sm text-neutral-500 group-hover:text-neutral-600 truncate mt-1 flex items-center gap-2">
                  <FiSearch className="w-3.5 h-3.5 text-neutral-400" />
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
