import React from "react";

type SchoolImageProps = {
  schoolType: string;
  className?: string;
};

const SchoolImage: React.FC<SchoolImageProps> = ({
  schoolType,
  className = "",
}) => {
  // Determine background color and styling based on school type
  let bgGradient = "bg-gradient-to-br from-gray-200 to-gray-300";
  let textColor = "text-gray-800";
  let label = "Sekolah";
  let icon = "🏫";

  if (schoolType.toLowerCase().includes("sd")) {
    bgGradient = "bg-gradient-to-br from-green-200 to-emerald-300";
    textColor = "text-green-800";
    label = "SD";
    icon = "🏫";
  } else if (schoolType.toLowerCase().includes("smp")) {
    bgGradient = "bg-gradient-to-br from-blue-200 to-indigo-300";
    textColor = "text-blue-800";
    label = "SMP";
    icon = "🏫";
  } else if (schoolType.toLowerCase().includes("sma")) {
    bgGradient = "bg-gradient-to-br from-indigo-200 to-purple-300";
    textColor = "text-indigo-800";
    label = "SMA";
    icon = "🎓";
  }

  return (
    <div
      className={`flex flex-col items-center justify-center ${bgGradient} ${className} relative overflow-hidden`}
    >
      {/* Decorative elements */}
      <div className="absolute w-32 h-32 rounded-full bg-white/10 top-10 -right-10"></div>
      <div className="absolute w-24 h-24 rounded-full bg-white/10 -bottom-5 -left-10"></div>

      <div className="flex flex-col items-center justify-center z-10">
        <span className="text-4xl mb-1">{icon}</span>
        <span className={`text-3xl font-bold ${textColor}`}>{label}</span>
      </div>
    </div>
  );
};

export default SchoolImage;
