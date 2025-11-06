"use client"

import type { User } from "@/types"

interface SidebarProps {
  user: User
  currentSection: string
  onSectionChange: (section: string) => void
}

export default function Sidebar({ user, currentSection, onSectionChange }: SidebarProps) {
  const isAdminOrIT = user.role === "admin" || user.role === "it"

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen sticky top-16">
      <nav className="p-4 space-y-2">
        <button
          onClick={() => onSectionChange("dashboard")}
          className={`sidebar-link w-full text-left px-4 py-3 rounded-lg flex items-center ${
            currentSection === "dashboard" ? "active" : ""
          }`}
        >
          <i className="fas fa-home w-6"></i>
          <span className="ml-3">หน้าหลัก</span>
        </button>

        <button
          onClick={() => onSectionChange("newRequest")}
          className={`sidebar-link w-full text-left px-4 py-3 rounded-lg flex items-center ${
            currentSection === "newRequest" ? "active" : ""
          }`}
        >
          <i className="fas fa-plus-circle w-6"></i>
          <span className="ml-3">แจ้งซ่อม</span>
        </button>

        <button
          onClick={() => onSectionChange("trackStatus")}
          className={`sidebar-link w-full text-left px-4 py-3 rounded-lg flex items-center ${
            currentSection === "trackStatus" ? "active" : ""
          }`}
        >
          <i className="fas fa-tasks w-6"></i>
          <span className="ml-3">ติดตามสถานะ</span>
        </button>

        <button
          onClick={() => onSectionChange("history")}
          className={`sidebar-link w-full text-left px-4 py-3 rounded-lg flex items-center ${
            currentSection === "history" ? "active" : ""
          }`}
        >
          <i className="fas fa-history w-6"></i>
          <span className="ml-3">ประวัติการแจ้งซ่อม</span>
        </button>

        {isAdminOrIT && (
          <>
            <hr className="my-4" />
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase mb-2">เมนูผู้ดูแลระบบ</p>

            <button
              onClick={() => onSectionChange("adminDashboard")}
              className={`sidebar-link w-full text-left px-4 py-3 rounded-lg flex items-center ${
                currentSection === "adminDashboard" ? "active" : ""
              }`}
            >
              <i className="fas fa-chart-line w-6"></i>
              <span className="ml-3">แดชบอร์ด</span>
            </button>

            <button
              onClick={() => onSectionChange("manageUsers")}
              className={`sidebar-link w-full text-left px-4 py-3 rounded-lg flex items-center ${
                currentSection === "manageUsers" ? "active" : ""
              }`}
            >
              <i className="fas fa-users w-6"></i>
              <span className="ml-3">จัดการผู้ใช้</span>
            </button>

            <button
              onClick={() => onSectionChange("manageEquipment")}
              className={`sidebar-link w-full text-left px-4 py-3 rounded-lg flex items-center ${
                currentSection === "manageEquipment" ? "active" : ""
              }`}
            >
              <i className="fas fa-laptop w-6"></i>
              <span className="ml-3">จัดการครุภัณฑ์</span>
            </button>
          </>
        )}
      </nav>
    </aside>
  )
}
