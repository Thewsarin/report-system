import { NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET - ดึงรายการบทบาททั้งหมด
export async function GET() {
  try {
    const roles = await query("SELECT * FROM role ORDER BY Role_ID")

    return NextResponse.json(roles)
  } catch (error) {
    console.error("Get roles error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลบทบาท" }, { status: 500 })
  }
}
