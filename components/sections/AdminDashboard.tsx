"use client"

import { useEffect, useState } from "react"
import { getUsers, getRequests, getEquipment } from "@/lib/data"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRequests: 0,
    totalEquipment: 0,
    avgTime: "4.5",
  })
  const [equipmentStats, setEquipmentStats] = useState<{ [key: string]: number }>({})
  const [staffPerformance, setStaffPerformance] = useState<any[]>([])

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = () => {
    const allUsers = getUsers()
    const allRequests = getRequests()
    const allEquipment = getEquipment()

    setStats({
      totalUsers: allUsers.length,
      totalRequests: allRequests.length,
      totalEquipment: allEquipment.length,
      avgTime: "4.5",
    })

    const equipTypes: { [key: string]: number } = {}
    allRequests.forEach((req) => {
      equipTypes[req.equipmentType] = (equipTypes[req.equipmentType] || 0) + 1
    })
    setEquipmentStats(equipTypes)

    const itStaff = allUsers.filter((u) => u.role === "it" || u.role === "admin")
    const performance = itStaff.map((staff) => {
      const assignedRequests = allRequests.filter((r) => r.assignedTo === staff.id)
      const completedRequests = assignedRequests.filter((r) => r.status === "เสร็จสิ้น")
      const completionRate =
        assignedRequests.length > 0 ? ((completedRequests.length / assignedRequests.length) * 100).toFixed(1) : 0

      return {
        name: staff.name,
        completed: completedRequests.length,
        total: assignedRequests.length,
        rate: completionRate,
      }
    })
    setStaffPerformance(performance)
  }

  return (
    <div className="fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">แดชบอร์ดผู้ดูแลระบบ</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">ผู้ใช้ทั้งหมด</h3>
            <i className="fas fa-users text-blue-500 text-2xl"></i>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">คำขอทั้งหมด</h3>
            <i className="fas fa-clipboard-list text-green-500 text-2xl"></i>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.totalRequests}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">ครุภัณฑ์</h3>
            <i className="fas fa-laptop text-purple-500 text-2xl"></i>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.totalEquipment}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">เวลาเฉลี่ย (ชม.)</h3>
            <i className="fas fa-clock text-orange-500 text-2xl"></i>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.avgTime}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">สถิติตามประเภทอุปกรณ์</h3>
          <div className="space-y-3">
            {Object.entries(equipmentStats).map(([type, count]) => {
              const total = Object.values(equipmentStats).reduce((a, b) => a + b, 0)
              const percentage = ((count / total) * 100).toFixed(1)

              return (
                <div key={type}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{type}</span>
                    <span className="text-sm text-gray-600">
                      {count} รายการ ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">ประสิทธิภาพเจ้าหน้าที่</h3>
          <div className="space-y-3">
            {staffPerformance.map((staff, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{staff.name}</span>
                  <span className="text-sm text-gray-600">
                    {staff.completed}/{staff.total} ({staff.rate}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${staff.rate}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
