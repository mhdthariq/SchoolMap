import { NextResponse } from 'next/server';
import pool from '@/lib/db';

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
};

export async function GET() {
  try {
    const result = await pool.query<SchoolRecord>(`
      SELECT 
        uuid, nama, npsn, alamat, status, bentuk_pendidikan, akreditasi,
        jumlah_guru, jumlah_murid,
        ST_X(geometri) AS lng,
        ST_Y(geometri) AS lat
      FROM sekolah
    `);

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json({ message: 'No schools found' }, { status: 404 });
    }

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching sekolah:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
