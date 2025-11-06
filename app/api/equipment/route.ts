import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET all equipment or filter by department
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const deptId = searchParams.get("deptId")

    let sql = `
      SELECT e.*, d.Dept_Name 
      FROM equipment e
      INNER JOIN department d ON e.Dept_ID = d.Dept_ID
    `
    const params: any[] = []

    if (deptId) {
      sql += " WHERE e.Dept_ID = ?"
      params.push(deptId)
    }

    sql += " ORDER BY e.Equip_Name"

    const equipment = await query<any[]>(sql, params)

    return NextResponse.json(equipment)
  } catch (error) {
    console.error("Get equipment error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลครุภัณฑ์" }, { status: 500 })
  }
}

// POST create new equipment
export async function POST(request: NextRequest) {
  try {
    const { assetNo, equipName, type, deptId } = await request.json()

    if (!assetNo || !equipName || !type || !deptId) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 })
    }

    // Check if asset number already exists
    const existing = await query<any[]>("SELECT Equip_ID FROM equipment WHERE Asset_No = ?", [assetNo])

    if (existing.length > 0) {
      return NextResponse.json({ error: "หมายเลขครุภัณฑ์นี้มีอยู่ในระบบแล้ว" }, { status: 409 })
    }

    const result = await query<any>(
      `INSERT INTO equipment (Asset_No, Equip_Name, Type, Dept_ID)
       VALUES (?, ?, ?, ?)`,
      [assetNo, equipName, type, deptId],
    )

    return NextResponse.json({
      success: true,
      equipId: result.insertId,
    })
  } catch (error) {
    console.error("Create equipment error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการสร้างครุภัณฑ์" }, { status: 500 })
  }
}
