// 68130500075 - Siripoom Limesoontorn
import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234', // เปลี่ยนตาม MySQL เครื่องฝึก ไม่ใช่รหัสที่ข้อสอบกำหนด
    database: 'mobile_distributor',
    decimalNumbers: true, // ให้ price DECIMAL เป็น number ใน JSON
    dateStrings: ['DATE'] // release_date เป็น YYYY-MM-DD ไม่เลื่อนตาม timezone
});
export default db;
