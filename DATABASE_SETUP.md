# คู่มือการติดตั้งและใช้งาน Database

## ขั้นตอนการติดตั้ง

### 1. ติดตั้ง MySQL/MariaDB

#### สำหรับ Windows (ใช้ XAMPP)
1. ดาวน์โหลดและติดตั้ง XAMPP จาก https://www.apachefriends.org/
2. เปิด XAMPP Control Panel
3. Start Apache และ MySQL

#### สำหรับ macOS
\`\`\`bash
brew install mysql
brew services start mysql
\`\`\`

#### สำหรับ Linux (Ubuntu/Debian)
\`\`\`bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
\`\`\`

### 2. สร้าง Database

เปิด phpMyAdmin หรือ MySQL Command Line และรันคำสั่ง:

\`\`\`bash
# เข้าสู่ MySQL
mysql -u root -p

# หรือใช้ phpMyAdmin ที่ http://localhost/phpmyadmin
\`\`\`

### 3. รัน SQL Scripts

#### วิธีที่ 1: ใช้ phpMyAdmin
1. เปิด phpMyAdmin (http://localhost/phpmyadmin)
2. คลิก "Import" ที่เมนูด้านบน
3. เลือกไฟล์ `scripts/01_create_tables.sql`
4. คลิก "Go"
5. ทำซ้ำกับไฟล์ `scripts/02_seed_data.sql`

#### วิธีที่ 2: ใช้ Command Line
\`\`\`bash
# สร้างตารางทั้งหมด
mysql -u root -p < scripts/01_create_tables.sql

# เพิ่มข้อมูลเริ่มต้น
mysql -u root -p < scripts/02_seed_data.sql
\`\`\`

### 4. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` ในโฟลเดอร์หลักของโปรเจค:

\`\`\`env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=it_service_db
\`\`\`

### 5. ติดตั้ง Dependencies

\`\`\`bash
npm install
# หรือ
yarn install
\`\`\`

### 6. รันโปรเจค

\`\`\`bash
npm run dev
# หรือ
yarn dev
\`\`\`

เปิดเบราว์เซอร์ที่ http://localhost:3000

## โครงสร้าง Database

### ตารางทั้งหมด (6 ตาราง)

1. **role** - บทบาทผู้ใช้งาน
   - 1 = ผู้ดูแลระบบ (Admin)
   - 2 = เจ้าหน้าที่ IT
   - 3 = บุคลากร

2. **department** - หน่วยงานต่างๆ ในโรงพยาบาล

3. **users** - ข้อมูลผู้ใช้งานทั้งหมด

4. **equipment** - ครุภัณฑ์และอุปกรณ์ IT

5. **request** - คำขอแจ้งซ่อม

6. **resolution** - ผลการดำเนินการซ่อม

### ความสัมพันธ์ระหว่างตาราง

\`\`\`
role (1) ----< (M) users
department (1) ----< (M) users
department (1) ----< (M) equipment
users (1) ----< (M) request [ผู้แจ้ง]
users (1) ----< (M) request [เจ้าหน้าที่ IT]
equipment (1) ----< (M) request
request (1) ---- (1) resolution
\`\`\`

## บัญชีทดสอบ

### ผู้ดูแลระบบ
- Username: `admin`
- Password: `password123`

### เจ้าหน้าที่ IT
- Username: `it_staff1`
- Password: `password123`

- Username: `it_staff2`
- Password: `password123`

### บุคลากร
- Username: `user001`
- Password: `password123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - เข้าสู่ระบบ
- `POST /api/auth/register` - ลงทะเบียน

### Departments
- `GET /api/departments` - ดึงข้อมูลหน่วยงานทั้งหมด
- `POST /api/departments` - สร้างหน่วยงานใหม่

### Equipment
- `GET /api/equipment` - ดึงข้อมูลครุภัณฑ์
- `GET /api/equipment?deptId=1` - ดึงข้อมูลครุภัณฑ์ตามหน่วยงาน
- `POST /api/equipment` - สร้างครุภัณฑ์ใหม่

### Requests
- `GET /api/requests` - ดึงข้อมูลคำขอทั้งหมด
- `GET /api/requests?userId=1&roleId=3` - ดึงข้อมูลคำขอตามผู้ใช้
- `POST /api/requests` - สร้างคำขอใหม่
- `PUT /api/requests` - อัพเดตคำขอ

### Resolutions
- `GET /api/resolutions?reqId=1` - ดึงข้อมูลผลการดำเนินการ
- `POST /api/resolutions` - บันทึกผลการดำเนินการ

### Statistics
- `GET /api/stats` - ดึงข้อมูลสถิติทั้งหมด

## การแก้ไขปัญหาที่พบบ่อย

### ไม่สามารถเชื่อมต่อ Database
1. ตรวจสอบว่า MySQL/MariaDB ทำงานอยู่
2. ตรวจสอบ username และ password ใน `.env.local`
3. ตรวจสอบว่าสร้าง database แล้ว

### Error: ER_NOT_SUPPORTED_AUTH_MODE
\`\`\`bash
# รันคำสั่งนี้ใน MySQL
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
\`\`\`

### Port 3306 ถูกใช้งานแล้ว
- เปลี่ยน port ใน MySQL configuration
- หรือปิดโปรแกรมที่ใช้ port 3306

## การ Backup Database

\`\`\`bash
# Backup ทั้ง database
mysqldump -u root -p it_service_db > backup.sql

# Restore จาก backup
mysql -u root -p it_service_db < backup.sql
\`\`\`

## การพัฒนาต่อ

### เพิ่มตารางใหม่
1. สร้างไฟล์ SQL ใหม่ใน `scripts/`
2. รันผ่าน phpMyAdmin หรือ command line
3. อัพเดต TypeScript types ใน `types/index.ts`
4. สร้าง API endpoint ใหม่ใน `app/api/`

### เพิ่ม API Endpoint ใหม่
1. สร้างโฟลเดอร์ใหม่ใน `app/api/`
2. สร้างไฟล์ `route.ts`
3. ใช้ `query()` หรือ `transaction()` จาก `lib/db.ts`
4. Return NextResponse.json()
