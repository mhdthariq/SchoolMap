export type Sekolah = {
  uuid: string; // Changed from id: number
  nama: string;
  npsn: string;
  alamat: string;
  status: string;
  bentuk_pendidikan: string;
  akreditasi: string;
  jumlah_guru: number;
  jumlah_murid: number;
  lat: number;
  lng: number;
};

export const SCHOOL_COLORS = {
  SD: {
    base: "bg-blue-600",
    light: "bg-blue-500/20 text-blue-300",
    number: "text-blue-400",
  },
  SMP: {
    base: "bg-emerald-600",
    light: "bg-emerald-500/20 text-emerald-300",
    number: "text-emerald-400",
  },
  SMA: {
    base: "bg-purple-600",
    light: "bg-purple-500/20 text-purple-300",
    number: "text-purple-400",
  },
} as const;

export const AKREDITASI_COLORS = {
  A: "from-green-600 to-emerald-500", // Excellent - green shades
  B: "from-yellow-500 to-amber-400", // Good - yellow/amber
  C: "from-orange-500 to-red-400", // Fair - orange to red
  NA: "from-gray-400 to-gray-600", // Not Accredited - neutral gray
};

export const getSchoolColor = (type: string) => {
  return SCHOOL_COLORS[type as keyof typeof SCHOOL_COLORS] || SCHOOL_COLORS.SD;
};

export const getAkreditasiGradient = (akreditasi: string) => {
  return (
    AKREDITASI_COLORS[akreditasi as keyof typeof AKREDITASI_COLORS] ||
    "from-gray-500 to-gray-600"
  );
};
