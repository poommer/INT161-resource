import db from '../configs-$id/db-config.js';

// รายการใช้เฉพาะ field Summary; ORDER BY ทำให้แบ่งหน้าได้ลำดับแน่นอน
const FIND_ALL_SQL = `
    SELECT id, sku, name, brand_id, category, price, status
    FROM products
    ORDER BY id
    LIMIT ? OFFSET ?
`;
// COUNT ต้องนับทั้งหมดก่อน LIMIT ไม่ใช่นับแค่แถวในหน้าปัจจุบัน
const COUNT_SQL = 'SELECT COUNT(*) AS total FROM products';
const FIND_ONE_SQL = `
    SELECT p.*, b.name AS brand_name
    FROM products p
    JOIN brands b ON b.id = p.brand_id
    WHERE p.id = ?
`;

export async function findAll({ limit, offset }) {
    // ผล query ชั้นแรกมี rows; rows ชั้นถัดไปมีแถว count หนึ่งแถว
    const [[count]] = await db.query(COUNT_SQL);
    const [rows] = await db.query(FIND_ALL_SQL, [limit, offset]);
    return { rows, total: Number(count.total) };
}

export async function findOne(id) {
    // JOIN แบรนด์เพื่อให้ Detail DTO มี brandName
    const [rows] = await db.query(FIND_ONE_SQL, [id]);
    return rows[0] ?? null;
}

export async function create(data) {
    // ใช้ query() กับ SET ? แบบ template: driver แปลง object เป็นชื่อ column/ค่า
    // service คัดเฉพาะ field ที่อนุญาตแล้วก่อนส่ง object เข้ามา
    const [result] = await db.query('INSERT INTO products SET ?', [data]);
    // schema นี้ id เป็น AUTO_INCREMENT จึงอ่านกลับด้วย insertId
    return findOne(result.insertId);
}

export async function update(id, data) {
    // SET เฉพาะ field ที่ส่งมา จึงแก้บาง field ได้ตาม test-runner
    // WHERE สำคัญมาก: ห้ามลืม มิฉะนั้นจะเปลี่ยนสินค้าทั้งตาราง
    await db.query('UPDATE products SET ? WHERE id = ?', [data, id]);
    return findOne(id);
}

export async function remove(id) {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
    // คืน boolean ให้ service: true ลบได้, false ไม่พบแถวให้ลบ
    return result.affectedRows > 0;
}
