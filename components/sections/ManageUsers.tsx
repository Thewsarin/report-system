"use client"

import { useEffect, useState } from "react"
import { getUsers, getDepartments, deleteUser } from "@/lib/data"
import type { User } from "@/types"

function getRoleText(role: string) {
  if (role === "admin") return "ผู้ดูแลระบบ"
  if (role === "it") return "เจ้าหน้าที่ IT"
  return "บุคลากร"
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    setUsers(getUsers())
  }

  const handleDelete = (userId: number) => {
    if (confirm("ต้องการลบผู้ใช้นี้หรือไม่?")) {
      deleteUser(userId)
      loadUsers()
    }
  }

  return (
    <div className="fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">จัดการผู้ใช้งาน</h2>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <button
            onClick={() => alert("ฟังก์ชันเพิ่มผู้ใช้ (ในระบบจริงจะเป็น Modal)")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200"
          >
            <i className="fas fa-plus mr-2"></i>เพิ่มผู้ใช้ใหม่
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">ชื่อผู้ใช้</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">ชื่อ-นามสกุล</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">บทบาท</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">หน่วยงาน</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => {
                const dept = getDepartments().find((d) => d.id === user.department)

                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{user.username}</td>
                    <td className="px-6 py-4 text-sm">{user.name}</td>
                    <td className="px-6 py-4 text-sm">{getRoleText(user.role)}</td>
                    <td className="px-6 py-4 text-sm">{dept?.name || "-"}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => alert(`แก้ไขผู้ใช้ ID: ${user.id}`)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
