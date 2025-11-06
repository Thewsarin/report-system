export interface User {
  User_ID: number
  Role_ID: number
  Dept_ID: number
  Username: string
  Name: string
  Tel: string
  Email: string
  Role_Name: string
  Dept_Name: string
  Created_At?: string
  Updated_At?: string
}

export interface Request {
  Req_ID: number
  User_ID: number
  Assigned_IT_ID: number | null
  Equip_ID: number
  Req_Date: string
  Req_Subject: string
  Req_Detail: string
  Current_Status: string
  Priority?: string
  // Joined fields from database
  User_Name?: string
  Equip_Name?: string
  Asset_No?: string
  Equip_Type?: string
  Dept_Name?: string
  IT_Name?: string
}

export interface Equipment {
  id: number
  assetNo: string
  name: string
  type: string
  department: number
}

export interface Department {
  id: number
  name: string
}
