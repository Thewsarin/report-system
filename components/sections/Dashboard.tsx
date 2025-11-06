"use client"

import { useEffect, useState } from "react"
import type { User, Request } from "@/types"
import { getRequests, getUsers } from "@/lib/data"

interface DashboardProps {
  user: User
}

export default function Dashboard({ user }: DashboardProps) {
  const [stats, setStats] = useState({ pending: 0, inProgress: 0, completed: 0 })
  const [recentRequests, setRecentRequests] = useState<Request[]>([])

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = () => {
    const allRequests = getRequests()
    const userRequests = user.role === "user" ? allRequests.filter((r) => r.userId === user.id) : allRequests

    setStats({
      pending: userRequests.filter((r) => r.status === "รอรับงาน").length,
      inProgress: userRequests.filter((r) => r.status === "กำลังดำเนินการ").length,
      completed: userRequests.filter((r) => r.status === "เสร็จสิ้น").length,
    })

    setRecentRequests(userRequests.slice(-5).reverse())
  }

  return (
    <div className="fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">หน้าหลัก</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">รอดำเนินการ</p>
              <p className="text-4xl font-bold">{stats.pending}</p>
            </div>
            <i className="fas fa-clock text-5xl text-blue-200 opacity-50"></i>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm mb-1">กำลังดำเนินการ</p>
              <p className="text-4xl font-bold">{stats.inProgress}</p>
            </div>
            <i className="fas fa-cog fa-spin text-5xl text-yellow-200 opacity-50"></i>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">เสร็จสิ้น</p>
              <p className="text-4xl font-bold">{stats.completed}</p>
            </div>
            <i className="fas fa-check-circle text-5xl text-green-200 opacity-50"></i>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">รายการแจ้งซ่อมล่าสุด</h3>
        <div className="space-y-4">
          {recentRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">ยังไม่มีรายการแจ้งซ่อม</p>
          ) : (
            recentRequests.map((req) => {
              const allUsers = getUsers()
              const reqUser = allUsers.find((u) => u.id === req.userId)
              const statusClass =
                req.status === "รอรับงาน"
                  ? "status-pending"
                  : req.status === "กำลังดำเนินการ"
                    ? "status-in-progress"
                    : "status-completed"

              return (
                <div
                  key={req.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{req.subject}</h4>
                    <span className={`status-badge ${statusClass}`}>{req.status}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{req.detail.substring(0, 100)}...</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>
                      <i className="fas fa-user mr-1"></i>
                      {reqUser?.name}
                    </span>
                    <span>
                      <i className="fas fa-calendar mr-1"></i>
                      {new Date(req.date).toLocaleDateString("th-TH")}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
