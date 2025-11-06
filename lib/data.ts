import type { User, Request, Equipment, Department } from "@/types"

let users: User[] = []
let requests: Request[] = []
let equipment: Equipment[] = []

export const departments: Department[] = [
  { id: 1, name: "แผนกผู้ป่วยนอก" },
  { id: 2, name: "แผนกผู้ป่วยใน" },
  { id: 3, name: "แผนกฉุกเฉิน" },
  { id: 4, name: "แผนกเภสัชกรรม" },
  { id: 5, name: "แผนกเทคโนโลยีสารสนเทศ" },
  { id: 6, name: "แผนกบริหาร" },
]

export function initializeDemoData() {
  if (typeof window === "undefined") return

  const savedUsers = localStorage.getItem("users")
  if (savedUsers && JSON.parse(savedUsers).length > 0) return

 

  equipment = [
    { id: 1, assetNo: "PC-001", name: "คอมพิวเตอร์ตั้งโต๊ะ Dell", type: "คอมพิวเตอร์", department: 1 },
    { id: 2, assetNo: "PR-001", name: "เครื่องพิมพ์ HP LaserJet", type: "เครื่องพิมพ์", department: 1 },
    { id: 3, assetNo: "PC-002", name: "คอมพิวเตอร์ตั้งโต๊ะ Lenovo", type: "คอมพิวเตอร์", department: 2 },
  ]

  requests = [
    {
      id: 1,
      userId: 3,
      equipmentType: "คอมพิวเตอร์",
      assetNo: "PC-001",
      subject: "คอมพิวเตอร์เปิดไม่ติด",
      detail: "กดปุ่มเปิดแล้วไม่มีอะไรเกิดขึ้น ไฟไม่ติด",
      priority: "ด่วน",
      location: "ห้องตรวจ 1",
      status: "รอรับงาน",
      date: new Date().toISOString(),
      assignedTo: null,
    },
    {
      id: 2,
      userId: 3,
      equipmentType: "เครื่องพิมพ์",
      assetNo: "PR-001",
      subject: "เครื่องพิมพ์ติดกระดาษ",
      detail: "กระดาษติดข้างในเครื่อง ดึงออกไม่ได้",
      priority: "ปกติ",
      location: "ห้องพยาบาล",
      status: "กำลังดำเนินการ",
      date: new Date(Date.now() - 86400000).toISOString(),
      assignedTo: 2,
    },
  ]

  saveToLocalStorage()
}

export function saveToLocalStorage() {
  if (typeof window === "undefined") return

  localStorage.setItem("users", JSON.stringify(users))
  localStorage.setItem("requests", JSON.stringify(requests))
  localStorage.setItem("equipment", JSON.stringify(equipment))
}

export function loadFromLocalStorage() {
  if (typeof window === "undefined") return

  const savedUsers = localStorage.getItem("users")
  const savedRequests = localStorage.getItem("requests")
  const savedEquipment = localStorage.getItem("equipment")

  if (savedUsers) users = JSON.parse(savedUsers)
  if (savedRequests) requests = JSON.parse(savedRequests)
  if (savedEquipment) equipment = JSON.parse(savedEquipment)
}

export function getUsers() {
  return users
}

export function getRequests() {
  return requests
}

export function getEquipment() {
  return equipment
}

export function getDepartments() {
  return departments
}

export function addUser(user: Omit<User, "id">) {
  const newUser = {
    ...user,
    id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
  }
  users.push(newUser)
  saveToLocalStorage()
  return newUser
}

export function addRequest(request: Omit<Request, "id">) {
  const newRequest = {
    ...request,
    id: requests.length > 0 ? Math.max(...requests.map((r) => r.id)) + 1 : 1,
  }
  requests.push(newRequest)
  saveToLocalStorage()
  return newRequest
}

export function addEquipment(eq: Omit<Equipment, "id">) {
  const newEquipment = {
    ...eq,
    id: equipment.length > 0 ? Math.max(...equipment.map((e) => e.id)) + 1 : 1,
  }
  equipment.push(newEquipment)
  saveToLocalStorage()
  return newEquipment
}

export function updateRequest(requestId: number, updates: Partial<Request>) {
  const request = requests.find((r) => r.id === requestId)
  if (request) {
    Object.assign(request, updates)
    saveToLocalStorage()
    return request
  }
  return null
}

export function deleteUser(userId: number) {
  users = users.filter((u) => u.id !== userId)
  saveToLocalStorage()
}

export function deleteEquipment(equipmentId: number) {
  equipment = equipment.filter((e) => e.id !== equipmentId)
  saveToLocalStorage()
}

export function authenticateUser(username: string, password: string) {
  return users.find((u) => u.username === username && u.password === password)
}
