import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // Get overall statistics
    const [totalRequests] = await query<any[]>("SELECT COUNT(*) as count FROM request")

    const [pendingRequests] = await query<any[]>(
      "SELECT COUNT(*) as count FROM request WHERE Current_Status = 'รอรับงาน'",
    )

    const [inProgressRequests] = await query<any[]>(
      "SELECT COUNT(*) as count FROM request WHERE Current_Status = 'กำลังดำเนินการ'",
    )

    const [completedRequests] = await query<any[]>(
      "SELECT COUNT(*) as count FROM request WHERE Current_Status = 'เสร็จสิ้น'",
    )

    // Get requests by priority
    const requestsByPriority = await query<any[]>(
      `SELECT Priority, COUNT(*) as count 
       FROM request 
       WHERE Current_Status != 'เสร็จสิ้น'
       GROUP BY Priority`,
    )

    // Get requests by department
    const requestsByDept = await query<any[]>(
      `SELECT d.Dept_Name, COUNT(*) as count
       FROM request r
       INNER JOIN users u ON r.User_ID = u.User_ID
       INNER JOIN department d ON u.Dept_ID = d.Dept_ID
       GROUP BY d.Dept_Name
       ORDER BY count DESC
       LIMIT 10`,
    )

    // Get average resolution time (in hours)
    const [avgResolutionTime] = await query<any[]>(
      `SELECT AVG(TIMESTAMPDIFF(HOUR, Start_Date, End_Date)) as avg_hours
       FROM resolution`,
    )

    // Get recent requests
    const recentRequests = await query<any[]>(
      `SELECT r.Req_ID, r.Req_Subject, r.Current_Status, r.Priority, r.Req_Date,
              u.Name as Requester_Name, d.Dept_Name
       FROM request r
       INNER JOIN users u ON r.User_ID = u.User_ID
       INNER JOIN department d ON u.Dept_ID = d.Dept_ID
       ORDER BY r.Req_Date DESC
       LIMIT 10`,
    )

    return NextResponse.json({
      total: totalRequests.count,
      pending: pendingRequests.count,
      inProgress: inProgressRequests.count,
      completed: completedRequests.count,
      byPriority: requestsByPriority,
      byDepartment: requestsByDept,
      avgResolutionHours: avgResolutionTime.avg_hours || 0,
      recentRequests,
    })
  } catch (error) {
    console.error("Get stats error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ" }, { status: 500 })
  }
}
