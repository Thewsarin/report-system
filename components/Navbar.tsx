"use client"

import type { User } from "@/types"
interface NavbarProps {
  user: User
  onLogout: () => void
}


export default function Navbar({ user, onLogout }: NavbarProps) {
  const handleLogout = () => {
    if (confirm("ต้องการออกจากระบบหรือไม่?")) {
      onLogout()
    }
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <i className="fas fa-hospital text-blue-600 text-2xl mr-3"></i>
            <div>
              <h1 className="text-xl font-bold text-gray-800">ระบบแจ้งซ่อม IT</h1>
              <p className="text-xs text-gray-500">โรงพยาบาลอินทร์บุรี</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
           <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-800">{user.Name}</p>
              <p className="text-xs text-gray-500">
                {user.Role_Name} - {user.Dept_Name}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>ออกจากระบบ
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
