"use client"

import { useEffect, useState } from "react"
import { getEquipment, getDepartments, deleteEquipment } from "@/lib/data"
import type { Equipment } from "@/types"

export default function ManageEquipment() {
  const [equipment, setEquipment] = useState<Equipment[]>([])

  useEffect(() => {
    loadEquipment()
  }, [])

  const loadEquipment = () => {
    setEquipment(getEquipment())
  }

  const handleDelete = (equipmentId: number) => {
    if (confirm("ต้องการลบครุภัณฑ์นี้หรือไม่?")) {
      deleteEquipment(equipmentId)
      loadEquipment()
    }
  }

  return (
    <div className="fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">จัดการครุภัณฑ์</h2>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <button
            onClick={() => alert("ฟังก์ชันเพิ่มครุภัณฑ์ (ในระบบจริงจะเป็น Modal)")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200"
          >
            <i className="fas fa-plus mr-2"></i>เพิ่มครุภัณฑ์ใหม่
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">หมายเลขครุภัณฑ์</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">ชื่ออุปกรณ์</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">ประเภท</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">หน่วยงาน</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {equipment.map((eq) => {
                const dept = getDepartments().find((d) => d.id === eq.department)

                return (
                  <tr key={eq.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{eq.assetNo}</td>
                    <td className="px-6 py-4 text-sm">{eq.name}</td>
                    <td className="px-6 py-4 text-sm">{eq.type}</td>
                    <td className="px-6 py-4 text-sm">{dept?.name || "-"}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => alert(`แก้ไขครุภัณฑ์ ID: ${eq.id}`)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDelete(eq.id)} className="text-red-600 hover:text-red-800">
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
