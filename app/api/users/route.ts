import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"

// GET - ดึงรายการผู้ใช้ทั้งหมด
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roleId = searchParams.get("roleId")

    let sql = `
      SELECT u.*, r.Role_Name, d.Dept_Name 
      FROM users u
      LEFT JOIN role r ON u.Role_ID = r.Role_ID
      LEFT JOIN department d ON u.Dept_ID = d.Dept_ID
    `
    const params: any[] = []

    if (roleId) {
      sql += " WHERE u.Role_ID = ?"
      params.push(roleId)
    }

    sql += " ORDER BY u.User_ID DESC"

    const users = await query(sql, params)

    // ไม่ส่ง password กลับไป
    const usersWithoutPassword = users.map((user: any) => {
      const { Password, ...userWithoutPassword } = user
      return userWithoutPassword
    })

    return NextResponse.json(usersWithoutPassword)
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" }, { status: 500 })
  }
}

// POST - สร้างผู้ใช้ใหม่
export async function POST(request: NextRequest) {
  try {
    const { roleId, deptId, username, password, name, tel, email } = await request.json()

    if (!username || !password || !name || !roleId) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน" }, { status: 400 })
    }

    // ตรวจสอบว่า username ซ้ำหรือไม่
    const existingUsers = await query("SELECT User_ID FROM users WHERE Username = ?", [username])

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว" }, { status: 409 })
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await query(
      `INSERT INTO users (Role_ID, Dept_ID, Username, Password, Name, Tel, Email)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [roleId, deptId || null, username, hashedPassword, name, tel || null, email || null],
    )

    return NextResponse.json(
      {
        message: "สร้างผู้ใช้สำเร็จ",
        userId: result.insertId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการสร้างผู้ใช้" }, { status: 500 })
  }
}

// PUT - แก้ไขข้อมูลผู้ใช้
export async function PUT(request: NextRequest) {
  try {
    const { userId, roleId, deptId, username, password, name, tel, email } = await request.json()

    if (!userId || !username || !name || !roleId) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน" }, { status: 400 })
    }

    // ตรวจสอบว่า username ซ้ำกับคนอื่นหรือไม่
    const existingUsers = await query("SELECT User_ID FROM users WHERE Username = ? AND User_ID != ?", [
      username,
      userId,
    ])

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว" }, { status: 409 })
    }

    // ถ้ามีการเปลี่ยนรหัสผ่าน
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      await query(
        `UPDATE users 
         SET Role_ID = ?, Dept_ID = ?, Username = ?, Password = ?, Name = ?, Tel = ?, Email = ?
         WHERE User_ID = ?`,
        [roleId, deptId || null, username, hashedPassword, name, tel || null, email || null, userId],
      )
    } else {
      await query(
        `UPDATE users 
         SET Role_ID = ?, Dept_ID = ?, Username = ?, Name = ?, Tel = ?, Email = ?
         WHERE User_ID = ?`,
        [roleId, deptId || null, username, name, tel || null, email || null, userId],
      )
    }

    return NextResponse.json({ message: "แก้ไขข้อมูลผู้ใช้สำเร็จ" })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูลผู้ใช้" }, { status: 500 })
  }
}

// DELETE - ลบผู้ใช้
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "กรุณาระบุ User ID" }, { status: 400 })
    }

    await query("DELETE FROM users WHERE User_ID = ?", [userId])

    return NextResponse.json({ message: "ลบผู้ใช้สำเร็จ" })
  } catch (error) {
    console.error("Delete user error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการลบผู้ใช้" }, { status: 500 })
  }
}
