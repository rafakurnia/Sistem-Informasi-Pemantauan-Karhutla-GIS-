// File: src/app/api/route.js
// Pemilik: Rafa

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "SIGAPI - Sistem Informasi Pemantauan Karhutla (GIS)",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
}

