import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET all departments
export async function GET(request: NextRequest) {
  try {
    const departments = await query<any[]>("SELECT * FROM department ORDER BY Dept_Name")

    return NextResponse.json(departments)
  } catch (error) {
    console.error("Get departments error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลหน่วยงาน" }, { status: 500 })
  }
}

// POST create new department
export async function POST(request: NextRequest) {
  try {
    const { deptName } = await request.json()

    if (!deptName) {
      return NextResponse.json({ error: "กรุณากรอกชื่อหน่วยงาน" }, { status: 400 })
    }

    const result = await query<any>("INSERT INTO department (Dept_Name) VALUES (?)", [deptName])

    return NextResponse.json({
      success: true,
      deptId: result.insertId,
    })
  } catch (error) {
    console.error("Create department error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการสร้างหน่วยงาน" }, { status: 500 })
  }
}
