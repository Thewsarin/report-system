import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Validate input
    if (!username || !password) {
      return NextResponse.json({ error: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" }, { status: 400 })
    }

    // Query user from database
    const users = await query<any[]>(
      `SELECT u.*, r.Role_Name, d.Dept_Name 
       FROM users u
       INNER JOIN role r ON u.Role_ID = r.Role_ID
       INNER JOIN department d ON u.Dept_ID = d.Dept_ID
       WHERE u.Username = ?`,
      [username],
    )

    if (users.length === 0) {
      return NextResponse.json({ error: "ชื่อผู้ใช้ไม่ถูกต้อง" }, { status: 401 })
    }

    const user = users[0]

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.Password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 })
    }

    // Remove password from response
    const { Password, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" }, { status: 500 })
  }
}
