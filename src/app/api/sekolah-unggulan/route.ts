import { NextResponse } from "next/server";
import pool from "@/lib/db";

type SchoolRecord = {
  uuid: string;
  nama: string;
  npsn: string;
  alamat: string;
  status: string;
  bentuk_pendidikan: string;
  akreditasi: string;
  jumlah_guru: number;
  jumlah_murid: number;
  lng: number;
  lat: number;
  kelurahan_id: number;
  kelurahan_nama: string;
};

export async function GET() {
  try {
    const result = await pool.query<SchoolRecord>(`
      SELECT 
        s.uuid, s.nama, s.npsn, s.alamat, s.status, s.bentuk_pendidikan, s.akreditasi,
        s.jumlah_guru, s.jumlah_murid,
        ST_X(s.geometri) AS lng,
        ST_Y(s.geometri) AS lat,
        s.kelurahan_id,
        k.kelurahan AS kelurahan_nama      FROM sekolah s
      JOIN kelurahan k ON s.kelurahan_id = k.id
      WHERE s.akreditasi = 'A' AND (
        s.bentuk_pendidikan LIKE '%SD%' OR
        s.bentuk_pendidikan LIKE '%SMP%' OR 
        s.bentuk_pendidikan LIKE '%SMA%'
      )
      ORDER BY s.bentuk_pendidikan, s.nama
    `);

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json(
        { message: "No accredited schools found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching accredited schools:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
