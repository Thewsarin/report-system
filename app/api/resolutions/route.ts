import { type NextRequest, NextResponse } from "next/server"
import { query, transaction } from "@/lib/db"

// GET resolution by request ID
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const reqId = searchParams.get("reqId")

    if (!reqId) {
      return NextResponse.json({ error: "ไม่พบรหัสคำขอ" }, { status: 400 })
    }

    const resolutions = await query<any[]>(
      `SELECT res.*, u.Name AS IT_Name
       FROM resolution res
       INNER JOIN users u ON res.IT_User_ID = u.User_ID
       WHERE res.Req_ID = ?`,
      [reqId],
    )

    if (resolutions.length === 0) {
      return NextResponse.json({ error: "ไม่พบข้อมูลผลการดำเนินการ" }, { status: 404 })
    }

    return NextResponse.json(resolutions[0])
  } catch (error) {
    console.error("Get resolution error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลผลการดำเนินการ" }, { status: 500 })
  }
}

// POST create resolution and close request
export async function POST(request: NextRequest) {
  try {
    const { reqId, itUserId, startDate, endDate, actionTaken, resolutionDetail } = await request.json()

    if (!reqId || !itUserId || !startDate || !endDate || !actionTaken || !resolutionDetail) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 })
    }

    // Use transaction to ensure both operations succeed
    const result = await transaction(async (connection) => {
      // Insert resolution
      const [resResult] = await connection.execute(
        `INSERT INTO resolution (Req_ID, IT_User_ID, Start_Date, End_Date, Action_Taken, Resolution_Detail)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [reqId, itUserId, startDate, endDate, actionTaken, resolutionDetail],
      )

      // Update request status to completed
      await connection.execute(`UPDATE request SET Current_Status = 'เสร็จสิ้น' WHERE Req_ID = ?`, [reqId])

      return resResult
    })

    return NextResponse.json({
      success: true,
      message: "บันทึกผลการดำเนินการสำเร็จ",
      resId: (result as any).insertId,
    })
  } catch (error) {
    console.error("Create resolution error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการบันทึกผลการดำเนินการ" }, { status: 500 })
  }
}
