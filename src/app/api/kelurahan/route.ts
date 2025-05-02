import { NextResponse } from 'next/server';
import pool from '@/lib/db';

type KelurahanRecord = {
  id: number;
  kelurahan: string;
  kecamatan: string;
  provinsi: string;
  kode_pos: string;
  luas: number;
  geometry: any; // GeoJSON geometry
};

export async function GET() {
  try {
    const result = await pool.query<KelurahanRecord>(`
      SELECT 
        id, kelurahan, kecamatan, provinsi, kode_pos, luas,
        ST_AsGeoJSON(geometri) AS geometry
      FROM kelurahan
    `);

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json({ message: 'No kelurahan data found' }, { status: 404 });
    }

    // Transform the data to include properly parsed GeoJSON
    const formattedData = result.rows.map(row => {
      return {
        id: row.id,
        kelurahan: row.kelurahan,
        kecamatan: row.kecamatan,
        provinsi: row.provinsi,
        kode_pos: row.kode_pos,
        luas: row.luas,
        geometry: JSON.parse(row.geometry)
      };
    });

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching kelurahan data:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}