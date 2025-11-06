"use client"

import { useEffect, useState } from "react"
import type { User, Request } from "@/types"

interface TrackStatusProps {
  user: User
}

export default function TrackStatus({ user }: TrackStatusProps) {
  const [requests, setRequests] = useState<Request[]>([])
  const [statusFilter, setStatusFilter] = useState("")
  const [searchText, setSearchText] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRequests()
  }, [user])

  const loadRequests = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/requests?userId=${user.User_ID}&roleId=${user.Role_ID}`)

      if (!response.ok) {
        throw new Error("Failed to fetch requests")
      }

      const data = await response.json()
      setRequests(data.requests || [])
    } catch (error) {
      console.error("Error loading requests:", error)
      alert("เกิดข้อผิดพลาดในการโหลดข้อมูล")
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = async () => {
    try {
      setLoading(true)
      let url = `/api/requests?userId=${user.User_ID}&roleId=${user.Role_ID}`

      if (statusFilter) {
        url += `&status=${encodeURIComponent(statusFilter)}`
      }

      if (searchText) {
        url += `&search=${encodeURIComponent(searchText)}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Failed to filter requests")
      }

      const data = await response.json()
      setRequests(data.requests || [])
    } catch (error) {
      console.error("Error filtering requests:", error)
      alert("เกิดข้อผิดพลาดในการค้นหา")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (requestId: number, newStatus: string) => {
    try {
      const updates: any = { status: newStatus }

      if (newStatus === "กำลังดำเนินการ") {
        const request = requests.find((r) => r.Req_ID === requestId)
        if (request && !request.Assigned_IT_ID) {
          updates.assignedItId = user.User_ID
        }
      }

      const response = await fetch(`/api/requests`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reqId: requestId,
          ...updates,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update request")
      }

      await loadRequests()
      alert(`อัพเดตสถานะเป็น "${newStatus}" เรียบร้อยแล้ว`)
    } catch (error) {
      console.error("Error updating request:", error)
      alert("เกิดข้อผิดพลาดในการอัพเดตสถานะ")
    }
  }

  const isAdminOrIT = user.Role_ID === 1 || user.Role_ID === 2

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
      <h2 className="text-3xl font-bold text-gray-800 mb-6">ติดตามสถานะการแจ้งซ่อม</h2>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6 flex flex-wrap gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">ทุกสถานะ</option>
            <option value="รอรับงาน">รอรับงาน</option>
            <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
            <option value="เสร็จสิ้น">เสร็จสิ้น</option>
          </select>

          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="ค้นหาด้วยหัวข้อหรือรายละเอียด..."
          />

          <button
            onClick={handleFilter}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            <i className="fas fa-search mr-2"></i>ค้นหา
          </button>
        </div>

        <div className="space-y-4">
          {requests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">ไม่พบรายการแจ้งซ่อม</p>
          ) : (
            requests.map((req) => {
              const statusClass =
                req.Current_Status === "รอรับงาน"
                  ? "status-pending"
                  : req.Current_Status === "กำลังดำเนินการ"
                    ? "status-in-progress"
                    : "status-completed"

              return (
                <div
                  key={req.Req_ID}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition duration-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 mb-1">{req.Req_Subject}</h4>
                      <p className="text-sm text-gray-500">รหัส: REQ-{String(req.Req_ID).padStart(4, "0")}</p>
                    </div>
                    <span className={`status-badge ${statusClass}`}>{req.Current_Status}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-600">ครุภัณฑ์:</span>
                      <span className="font-medium ml-2">{req.Equip_Name || "-"}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">ประเภท:</span>
                      <span className="font-medium ml-2">{req.Equip_Type || "-"}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">ผู้แจ้ง:</span>
                      <span className="font-medium ml-2">{req.User_Name || "-"}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">วันที่แจ้ง:</span>
                      <span className="font-medium ml-2">{new Date(req.Req_Date).toLocaleDateString("th-TH")}</span>
                    </div>
                    {req.Priority && (
                      <div>
                        <span className="text-gray-600">ความเร่งด่วน:</span>
                        <span className="font-medium ml-2">{req.Priority}</span>
                      </div>
                    )}
                    {req.IT_Name && (
                      <div>
                        <span className="text-gray-600">ผู้รับผิดชอบ:</span>
                        <span className="font-medium ml-2">{req.IT_Name}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4">{req.Req_Detail}</p>

                  {isAdminOrIT && req.Current_Status !== "เสร็จสิ้น" && (
                    <div className="flex gap-2">
                      {req.Current_Status === "รอรับงาน" && (
                        <button
                          onClick={() => handleUpdateStatus(req.Req_ID, "กำลังดำเนินการ")}
                          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                        >
                          <i className="fas fa-play mr-2"></i>เริ่มดำเนินการ
                        </button>
                      )}
                      <button
                        onClick={() => handleUpdateStatus(req.Req_ID, "เสร็จสิ้น")}
                        className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                      >
                        <i className="fas fa-check mr-2"></i>ปิดงาน
                      </button>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
