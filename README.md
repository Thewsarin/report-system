# ระบบบริหารจัดการแจ้งซ่อมและบริการด้าน IT - โรงพยาบาลอินทร์บุรี

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/thewfatty-2844s-projects/v0-html-css-tailwind-js)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/ncqIIoYqqzY)

## ภาพรวมโครงการ

ระบบบริหารจัดการแจ้งซ่อมและบริการด้าน IT สำหรับโรงพยาบาลอินทร์บุรี พัฒนาด้วย Next.js 16, React 19, TypeScript และ Tailwind CSS

## คุณสมบัติหลัก

- **ระบบจัดการผู้ใช้งาน** - รองรับ 3 บทบาท (Admin, เจ้าหน้าที่ IT, บุคลากร)
- **ระบบแจ้งซ่อม** - แจ้งซ่อมอุปกรณ์และติดตามสถานะแบบเรียลไทม์
- **ระบบจัดการครุภัณฑ์** - บริหารจัดการอุปกรณ์ IT ทั้งหมด
- **แดชบอร์ด** - สรุปสถิติและรายงานผลการดำเนินงาน
- **ประวัติการแจ้งซ่อม** - ตรวจสอบประวัติย้อนหลัง

## เทคโนโลยีที่ใช้

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Font Awesome 6
- **Storage**: localStorage (พร้อมเชื่อมต่อ Backend)

## การติดตั้งและรันโปรเจค

\`\`\`bash
# ติดตั้ง dependencies
npm install

# รันในโหมด development
npm run dev

# Build สำหรับ production
npm run build

# รัน production server
npm start
\`\`\`

เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

## บัญชีทดสอบ

- **Admin**: `admin` / `admin123`
- **เจ้าหน้าที่ IT**: `it_staff` / `it123`
- **บุคลากร**: `user` / `user123`

## โครงสร้างโปรเจค

\`\`\`
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # หน้าหลัก
│   └── globals.css         # Global styles
├── components/
│   ├── LoginPage.tsx       # หน้า Login
│   ├── RegisterPage.tsx    # หน้าลงทะเบียน
│   ├── MainApp.tsx         # แอปหลัก
│   ├── Navbar.tsx          # Navigation bar
│   ├── Sidebar.tsx         # Sidebar menu
│   └── sections/           # หน้าต่างๆ ของระบบ
│       ├── Dashboard.tsx
│       ├── NewRequest.tsx
│       ├── TrackStatus.tsx
│       ├── History.tsx
│       ├── AdminDashboard.tsx
│       ├── ManageUsers.tsx
│       └── ManageEquipment.tsx
├── lib/
│   └── data.ts             # จัดการข้อมูล localStorage
└── types/
    └── index.ts            # TypeScript types

\`\`\`

## การพัฒนาต่อ

ระบบปัจจุบันใช้ localStorage สำหรับจัดเก็บข้อมูล หากต้องการเชื่อมต่อกับ Backend จริง สามารถ:

1. สร้าง API Routes ใน `app/api/`
2. เชื่อมต่อกับ Database (MySQL, PostgreSQL, MongoDB)
3. ใช้ ORM เช่น Prisma หรือ Drizzle
4. เพิ่ม Authentication ด้วย NextAuth.js

## Deployment

โปรเจคนี้ deploy บน Vercel:

**[https://vercel.com/thewfatty-2844s-projects/v0-html-css-tailwind-js](https://vercel.com/thewfatty-2844s-projects/v0-html-css-tailwind-js)**

## สร้างโดย

พัฒนาด้วย [v0.app](https://v0.app) - AI-powered development platform

**[https://v0.app/chat/ncqIIoYqqzY](https://v0.app/chat/ncqIIoYqqzY)**
