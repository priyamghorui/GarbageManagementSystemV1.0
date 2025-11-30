import * as XLSX from "xlsx";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import beneficiaryDetails from "@/model/beneficiaryDetails";

// ---------------- Upload API ----------------
export async function POST(req:any) {
  try {
    // 1. Read raw file bytes directly into memory
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Parse Excel
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    // 3. Insert into MongoDB
    await beneficiaryDetails.insertMany(rows,{ ordered: false });

    return NextResponse.json({
      success: true,
      data: rows.length,
    });
  } catch (error:any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
