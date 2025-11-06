"use client"

import { useRouter } from "next/navigation"
import LoginPage from "@/components/LoginPage"
import type { User } from "@/types"

export default function Login() {
  const router = useRouter()

  const handleLoginSuccess = (user: User) => {
    // Store user session in localStorage
    localStorage.setItem("currentUser", JSON.stringify(user))
    // Redirect to home page
    router.push("/")
  }

  const handleRegisterClick = () => {
    router.push("/register")
  }

  return <LoginPage onLoginSuccess={handleLoginSuccess} onRegisterClick={handleRegisterClick} />
}
