"use client"

import { useEffect, useState } from "react"
import type { User, Request } from "@/types"

interface HistoryProps {
  user: User
}

export default function History({ user }: HistoryProps) {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [user])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/requests?userId=${user.User_ID}&roleId=${user.Role_ID}`)

      if (!response.ok) {
        throw new Error("Failed to fetch history")
      }

      const data = await response.json()
      setRequests(data.requests || [])
    } catch (error) {
      console.error("Error loading history:", error)
      alert("เกิดข้อผิดพลาดในการโหลดประวัติ")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="fade-in flex justify-center items-center py-20">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">ประวัติการแจ้งซ่อม</h2>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">รหัส</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">วันที่แจ้ง</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">หัวข้อ</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">ครุภัณฑ์</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">ประเภท</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    ไม่มีประวัติการแจ้งซ่อม
                  </td>
                </tr>
              ) : (
                requests.map((req) => {
                  const statusClass =
                    req.Current_Status === "รอรับงาน"
                      ? "status-pending"
                      : req.Current_Status === "กำลังดำเนินการ"
                        ? "status-in-progress"
                        : "status-completed"

                  return (
                    <tr key={req.Req_ID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">REQ-{String(req.Req_ID).padStart(4, "0")}</td>
                      <td className="px-6 py-4 text-sm">{new Date(req.Req_Date).toLocaleDateString("th-TH")}</td>
                      <td className="px-6 py-4 text-sm font-medium">{req.Req_Subject}</td>
                      <td className="px-6 py-4 text-sm">{req.Equip_Name || "-"}</td>
                      <td className="px-6 py-4 text-sm">{req.Equip_Type || "-"}</td>
                      <td className="px-6 py-4">
                        <span className={`status-badge ${statusClass}`}>{req.Current_Status}</span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
