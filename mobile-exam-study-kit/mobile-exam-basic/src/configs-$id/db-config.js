// 68130500075 - MySQL pool ตามไฟล์เดิม
import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    // เปลี่ยนเฉพาะค่าตั้งต้นนี้ให้ตรง MySQL ของเครื่องฝึก; ไม่ใช่รหัสในโจทย์
    password: '1234',
    database: 'mobile_distributor',
    // DECIMAL price เป็น number ใน JSON ไม่ใช่ string เช่น "48900.00"
    decimalNumbers: true,
    // DATE คงเป็น YYYY-MM-DD ไม่แปลงเป็น Date ที่มีเวลา/timezone
    dateStrings: ['DATE']
});
export default db;
