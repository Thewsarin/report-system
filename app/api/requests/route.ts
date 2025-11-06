import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET all requests or filter by user/status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")
    const roleId = searchParams.get("roleId")
    const search = searchParams.get("search")

    let sql = `
      SELECT 
        r.Req_ID,
        r.User_ID,
        r.Assigned_IT_ID,
        r.Equip_ID,
        r.Req_Date,
        r.Req_Subject,
        r.Req_Detail,
        r.Current_Status,
        r.Priority,
        u.Name AS User_Name,
        u.Tel AS User_Tel,
        d.Dept_Name AS User_Dept,
        e.Asset_No,
        e.Equip_Name,
        e.Type AS Equip_Type,
        it_user.Name AS IT_Name
      FROM request r
      INNER JOIN users u ON r.User_ID = u.User_ID
      INNER JOIN department d ON u.Dept_ID = d.Dept_ID
      INNER JOIN equipment e ON r.Equip_ID = e.Equip_ID
      LEFT JOIN users it_user ON r.Assigned_IT_ID = it_user.User_ID
      WHERE 1=1
    `
    const params: any[] = []

    // If regular user (role 3), only show their requests
    if (roleId === "3" && userId) {
      sql += " AND r.User_ID = ?"
      params.push(userId)
    }

    // If IT staff (role 2), show assigned requests
    if (roleId === "2" && userId) {
      sql += " AND (r.Assigned_IT_ID = ? OR r.Assigned_IT_ID IS NULL)"
      params.push(userId)
    }

    if (status) {
      sql += " AND r.Current_Status = ?"
      params.push(status)
    }

    if (search) {
      sql += " AND (r.Req_Subject LIKE ? OR r.Req_Detail LIKE ?)"
      const searchPattern = `%${search}%`
      params.push(searchPattern, searchPattern)
    }

    sql += " ORDER BY r.Req_Date DESC"

    const requests = await query<any[]>(sql, params)

    return NextResponse.json({
      success: true,
      requests: requests,
    })
  } catch (error) {
    console.error("Get requests error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลคำขอ" }, { status: 500 })
  }
}

// POST create new request
export async function POST(request: NextRequest) {
  try {
    const { userId, equipId, subject, detail, priority } = await request.json()

    if (!userId || !equipId || !subject || !detail) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 })
    }

    const result = await query<any>(
      `INSERT INTO request (User_ID, Equip_ID, Req_Subject, Req_Detail, Priority, Current_Status)
       VALUES (?, ?, ?, ?, ?, 'รอรับงาน')`,
      [userId, equipId, subject, detail, priority || "ปานกลาง"],
    )

    return NextResponse.json({
      success: true,
      reqId: result.insertId,
    })
  } catch (error) {
    console.error("Create request error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการสร้างคำขอ" }, { status: 500 })
  }
}

// PUT update request
export async function PUT(request: NextRequest) {
  try {
    const { reqId, assignedItId, status } = await request.json()

    if (!reqId) {
      return NextResponse.json({ error: "ไม่พบรหัสคำขอ" }, { status: 400 })
    }

    let sql = "UPDATE request SET "
    const params: any[] = []
    const updates: string[] = []

    if (assignedItId !== undefined) {
      updates.push("Assigned_IT_ID = ?")
      params.push(assignedItId)
    }

    if (status) {
      updates.push("Current_Status = ?")
      params.push(status)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "ไม่มีข้อมูลที่ต้องการอัพเดต" }, { status: 400 })
    }

    sql += updates.join(", ") + " WHERE Req_ID = ?"
    params.push(reqId)

    await query(sql, params)

    return NextResponse.json({
      success: true,
      message: "อัพเดตคำขอสำเร็จ",
    })
  } catch (error) {
    console.error("Update request error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการอัพเดตคำขอ" }, { status: 500 })
  }
}
