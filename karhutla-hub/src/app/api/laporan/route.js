// File: src/app/api/laporan/route.js
// Pemilik: Rafa

import { NextResponse } from "next/server";
import { ambilLaporanPublik } from "@/queries/laporan";

export async function GET() {
  const laporan = await ambilLaporanPublik();
  return NextResponse.json({
    ok: true,
    data: laporan,
    total: laporan.length,
  });
}

