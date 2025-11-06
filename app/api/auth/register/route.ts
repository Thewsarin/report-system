import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { username, password, name, tel, email, deptId } = await request.json()

    // Validate input
    if (!username || !password || !name || !deptId) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 })
    }

    // Check if username already exists
    const existingUsers = await query<any[]>("SELECT User_ID FROM users WHERE Username = ?", [username])

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert new user (default role is 3 = บุคลากร)
    const result = await query<any>(
      `INSERT INTO users (Role_ID, Dept_ID, Username, Password, Name, Tel, Email)
       VALUES (3, ?, ?, ?, ?, ?, ?)`,
      [deptId, username, hashedPassword, name, tel || null, email || null],
    )

    return NextResponse.json({
      success: true,
      message: "ลงทะเบียนสำเร็จ",
      userId: result.insertId,
    })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการลงทะเบียน" }, { status: 500 })
  }
}
