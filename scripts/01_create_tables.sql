-- ระบบบริหารจัดการแจ้งซ่อมและบริการด้าน IT โรงพยาบาลอินทร์บุรี
-- Database Schema Creation Script

-- สร้างฐานข้อมูล
CREATE DATABASE IF NOT EXISTS it_service_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE it_service_db;

-- ตารางที่ 1: บทบาท (role)
CREATE TABLE IF NOT EXISTS role (
    Role_ID INT(11) NOT NULL AUTO_INCREMENT,
    Role_Name VARCHAR(50) NOT NULL,
    PRIMARY KEY (Role_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางบทบาทผู้ใช้งาน';

-- ตารางที่ 2: หน่วยงาน (department)
CREATE TABLE IF NOT EXISTS department (
    Dept_ID INT(11) NOT NULL AUTO_INCREMENT,
    Dept_Name VARCHAR(100) NOT NULL,
    PRIMARY KEY (Dept_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางหน่วยงาน';

-- ตารางที่ 3: ข้อมูลผู้ใช้ (users)
CREATE TABLE IF NOT EXISTS users (
    User_ID INT(11) NOT NULL AUTO_INCREMENT,
    Role_ID INT(11) NOT NULL,
    Dept_ID INT(11) NOT NULL,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL COMMENT 'เข้ารหัสด้วย bcrypt',
    Name VARCHAR(150) NOT NULL,
    Tel VARCHAR(20) DEFAULT NULL,
    Email VARCHAR(100) DEFAULT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (User_ID),
    FOREIGN KEY (Role_ID) REFERENCES role(Role_ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (Dept_ID) REFERENCES department(Dept_ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_username (Username),
    INDEX idx_role (Role_ID),
    INDEX idx_dept (Dept_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางข้อมูลผู้ใช้งาน';

-- ตารางที่ 4: ครุภัณฑ์ (equipment)
CREATE TABLE IF NOT EXISTS equipment (
    Equip_ID INT(11) NOT NULL AUTO_INCREMENT,
    Asset_No VARCHAR(50) NOT NULL UNIQUE COMMENT 'หมายเลขครุภัณฑ์',
    Equip_Name VARCHAR(100) NOT NULL,
    Type VARCHAR(50) NOT NULL,
    Dept_ID INT(11) NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (Equip_ID),
    FOREIGN KEY (Dept_ID) REFERENCES department(Dept_ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_asset_no (Asset_No),
    INDEX idx_dept (Dept_ID),
    INDEX idx_type (Type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางครุภัณฑ์และอุปกรณ์';

-- ตารางที่ 5: คำขอแจ้งซ่อม (request)
CREATE TABLE IF NOT EXISTS request (
    Req_ID INT(11) NOT NULL AUTO_INCREMENT,
    User_ID INT(11) NOT NULL COMMENT 'ผู้แจ้งซ่อม',
    Assigned_IT_ID INT(11) DEFAULT NULL COMMENT 'เจ้าหน้าที่ IT ที่รับมอบหมาย',
    Equip_ID INT(11) NOT NULL,
    Req_Date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Req_Subject VARCHAR(255) NOT NULL,
    Req_Detail TEXT NOT NULL,
    Current_Status VARCHAR(50) NOT NULL DEFAULT 'รอรับงาน' COMMENT 'รอรับงาน, กำลังดำเนินการ, เสร็จสิ้น, ยกเลิก',
    Priority VARCHAR(20) DEFAULT 'ปานกลาง' COMMENT 'ด่วนมาก, ด่วน, ปานกลาง, ไม่ด่วน',
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (Req_ID),
    FOREIGN KEY (User_ID) REFERENCES users(User_ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (Assigned_IT_ID) REFERENCES users(User_ID) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (Equip_ID) REFERENCES equipment(Equip_ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_user (User_ID),
    INDEX idx_assigned_it (Assigned_IT_ID),
    INDEX idx_status (Current_Status),
    INDEX idx_date (Req_Date),
    INDEX idx_priority (Priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางคำขอแจ้งซ่อม';

-- ตารางที่ 6: ผลการดำเนินการ (resolution)
CREATE TABLE IF NOT EXISTS resolution (
    Res_ID INT(11) NOT NULL AUTO_INCREMENT,
    Req_ID INT(11) NOT NULL UNIQUE COMMENT 'ความสัมพันธ์ 1:1 กับ request',
    IT_User_ID INT(11) NOT NULL COMMENT 'เจ้าหน้าที่ IT ผู้ดำเนินการ',
    Start_Date DATETIME NOT NULL,
    End_Date DATETIME NOT NULL,
    Action_Taken VARCHAR(255) NOT NULL,
    Resolution_Detail TEXT NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (Res_ID),
    FOREIGN KEY (Req_ID) REFERENCES request(Req_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (IT_User_ID) REFERENCES users(User_ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_req (Req_ID),
    INDEX idx_it_user (IT_User_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางผลการดำเนินการ';

-- สร้าง View สำหรับรายงาน
CREATE OR REPLACE VIEW v_request_details AS
SELECT 
    r.Req_ID,
    r.Req_Subject,
    r.Req_Detail,
    r.Req_Date,
    r.Current_Status,
    r.Priority,
    u.Name AS Requester_Name,
    u.Tel AS Requester_Tel,
    u.Email AS Requester_Email,
    d.Dept_Name AS Requester_Dept,
    e.Asset_No,
    e.Equip_Name,
    e.Type AS Equipment_Type,
    it_user.Name AS Assigned_IT_Name,
    res.Action_Taken,
    res.Resolution_Detail,
    res.Start_Date,
    res.End_Date,
    TIMESTAMPDIFF(HOUR, res.Start_Date, res.End_Date) AS Resolution_Hours
FROM request r
INNER JOIN users u ON r.User_ID = u.User_ID
INNER JOIN department d ON u.Dept_ID = d.Dept_ID
INNER JOIN equipment e ON r.Equip_ID = e.Equip_ID
LEFT JOIN users it_user ON r.Assigned_IT_ID = it_user.User_ID
LEFT JOIN resolution res ON r.Req_ID = res.Req_ID;
