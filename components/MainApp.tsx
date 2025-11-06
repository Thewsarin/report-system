"use client"

import { useState } from "react"
import type { User } from "@/types"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import Dashboard from "./sections/Dashboard"
import NewRequest from "./sections/NewRequest"
import TrackStatus from "./sections/TrackStatus"
import History from "./sections/History"
import AdminDashboard from "./sections/AdminDashboard"
import ManageUsers from "./sections/ManageUsers"
import ManageEquipment from "./sections/ManageEquipment"

interface MainAppProps {
  user: User
  onLogout: () => void
}

export default function MainApp({ user, onLogout }: MainAppProps) {
  const [currentSection, setCurrentSection] = useState("dashboard")

  return (
    <div>
      <Navbar user={user} onLogout={onLogout} />

      <div className="flex">
        <Sidebar user={user} currentSection={currentSection} onSectionChange={setCurrentSection} />

        <main className="flex-1 p-8">
          {currentSection === "dashboard" && <Dashboard user={user} />}
          {currentSection === "newRequest" && <NewRequest user={user} />}
          {currentSection === "trackStatus" && <TrackStatus user={user} />}
          {currentSection === "history" && <History user={user} />}
          {currentSection === "adminDashboard" && <AdminDashboard />}
          {currentSection === "manageUsers" && <ManageUsers />}
          {currentSection === "manageEquipment" && <ManageEquipment />}
        </main>
      </div>
    </div>
  )
}
