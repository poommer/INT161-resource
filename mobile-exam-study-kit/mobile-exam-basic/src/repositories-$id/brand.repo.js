// Repository ทำเฉพาะ SQL และคืนข้อมูล ไม่ใช้ req/res
import db from '../configs-$id/db-config.js';

export async function findAll() {
    // mysql2 คืน [rows, fields]; เลือก rows ซึ่งเป็น array ของแบรนด์
    const [rows] = await db.query('SELECT * FROM brands ORDER BY id');
    return rows;
}

export async function findOne(id) {
    const [rows] = await db.query('SELECT * FROM brands WHERE id = ?', [id]);
    // แถวแรกเป็น object; ถ้าไม่พบให้ service เป็นผู้ throw 404
    return rows[0] ?? null;
}
