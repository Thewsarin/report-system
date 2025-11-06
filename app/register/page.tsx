"use client"

import { useRouter } from "next/navigation"
import RegisterPage from "@/components/RegisterPage"

export default function Register() {
  const router = useRouter()

  const handleRegisterSuccess = () => {
    // Redirect to login page after successful registration
    router.push("/login")
  }

  const handleBackClick = () => {
    router.push("/login")
  }

  return <RegisterPage onRegisterSuccess={handleRegisterSuccess} onBackClick={handleBackClick} />
}
