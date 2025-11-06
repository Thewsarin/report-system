"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { User } from "@/types"

interface NewRequestProps {
  user: User
}

interface Equipment {
  Equip_ID: number
  Asset_No: string
  Equip_Name: string
  Type: string
  Dept_ID: number
  Dept_Name: string
}

export default function NewRequest({ user }: NewRequestProps) {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    equipId: "",
    subject: "",
    detail: "",
    priority: "ปานกลาง",
  })

  useEffect(() => {
    fetchEquipment()
  }, [])

  const fetchEquipment = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/equipment?deptId=${user.Dept_ID}`)
      if (response.ok) {
        const data = await response.json()
        setEquipment(data)
      }
    } catch (error) {
      console.error("Error fetching equipment:", error)
      alert("เกิดข้อผิดพลาดในการโหลดข้อมูลครุภัณฑ์")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.equipId || !formData.subject || !formData.detail) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน")
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.User_ID,
          equipId: Number.parseInt(formData.equipId),
          subject: formData.subject,
          detail: formData.detail,
          priority: formData.priority,
        }),
      })

      if (response.ok) {
        alert("ส่งคำขอแจ้งซ่อมเรียบร้อยแล้ว")
        setFormData({
          equipId: "",
          subject: "",
          detail: "",
          priority: "ปานกลาง",
        })
      } else {
        const error = await response.json()
        alert(error.error || "เกิดข้อผิดพลาดในการส่งคำขอ")
      }
    } catch (error) {
      console.error("Error submitting request:", error)
      alert("เกิดข้อผิดพลาดในการส่งคำขอ")
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">แจ้งซ่อมอุปกรณ์</h2>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">เลือกครุภัณฑ์ *</label>
              <select
                name="equipId"
                value={formData.equipId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              >
                <option value="">{loading ? "กำลังโหลด..." : "เลือกครุภัณฑ์ที่ต้องการแจ้งซ่อม"}</option>
                {equipment.map((equip) => (
                  <option key={equip.Equip_ID} value={equip.Equip_ID}>
                    {equip.Asset_No} - {equip.Equip_Name} ({equip.Type})
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">แสดงเฉพาะครุภัณฑ์ในหน่วยงาน: {user.Dept_Name}</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">หัวข้อ *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="สรุปปัญหาโดยย่อ"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">รายละเอียดปัญหา *</label>
              <textarea
                name="detail"
                value={formData.detail}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="อธิบายปัญหาที่พบโดยละเอียด"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">ระดับความเร่งด่วน *</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="ปานกลาง">ปานกลาง</option>
                <option value="ด่วน">ด่วน</option>
                <option value="ด่วนมาก">ด่วนมาก</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  equipId: "",
                  subject: "",
                  detail: "",
                  priority: "ปานกลาง",
                })
              }
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition duration-200"
              disabled={submitting}
            >
              <i className="fas fa-redo mr-2"></i>ล้างข้อมูล
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200 shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={submitting || loading}
            >
              <i className="fas fa-paper-plane mr-2"></i>
              {submitting ? "กำลังส่ง..." : "ส่งคำขอ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
