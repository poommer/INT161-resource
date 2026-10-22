// Repository เดิมไฟล์เดียว: สินค้าเป็นหลัก และเพิ่มฟังก์ชันอ่านแบรนด์ในไฟล์นี้
import db from '../configs-$id/db-config.js';
import httpStatus from 'http-status'; // คง import จาก template; ตัวอย่างนี้ไม่ได้ใช้

const TABLE_NAME = 'products';
const ENTITY_NAME = 'Product'; // คงตัวแปรแนว template ไว้อ้างอิง
const COUNT_ALL = `SELECT COUNT(*) AS total FROM ${TABLE_NAME}`;
const FIND_ALL_SQL = `
    SELECT id, sku, name, brand_id, category, price, status
    FROM ${TABLE_NAME} ORDER BY id
`;
const FIND_ONE_SQL = `
    SELECT p.*, b.name AS brand_name
    FROM ${TABLE_NAME} p JOIN brands b ON b.id = p.brand_id
    WHERE p.id = ?
`;
const UPDATE_SQL = `UPDATE ${TABLE_NAME} SET ? WHERE id = ?`;
const REMOVE_SQL = `DELETE FROM ${TABLE_NAME} WHERE id = ?`;
const CREATE_SQL = `INSERT INTO ${TABLE_NAME} SET ?`;

export async function findAll(pagination) {
    if (!pagination) {
        const [rows] = await db.query(FIND_ALL_SQL);
        return rows;
    }
    const { limit, offset } = pagination;
    const [rows] = await db.query(FIND_ALL_SQL + ' LIMIT ? OFFSET ?', [limit, offset]);
    const [[count]] = await db.query(COUNT_ALL);
    // คงรูปแบบ array + totalItems ที่ helper/mapper เดิมของอาจารย์ใช้
    // property นี้อ่านใน JS ได้ แต่ไม่ออกไปเป็นสมาชิก JSON array โดยอัตโนมัติ
    rows.totalItems = Number(count.total);
    return rows;
}

export async function findOne(id) {
    // JOIN เพื่อให้ Detail DTO มี brandName
    const [rows] = await db.query(FIND_ONE_SQL, [id]);
    return rows[0] ?? null;
}

export async function update(id, data) {
    // service ตรวจว่ามี ID และคัด field ที่อนุญาตแล้ว
    await db.query(UPDATE_SQL, [data, id]);
    return findOne(id);
}

export async function remove(id) {
    const [result] = await db.query(REMOVE_SQL, [id]);
    return result.affectedRows > 0;
}

export async function create(data) {
    // query() รองรับ SET ? แบบ object; อย่าเปลี่ยนเป็น execute() โดยไม่ปรับ SQL
    const [result] = await db.query(CREATE_SQL, [data]);
    // schema มือถือใช้ id AUTO_INCREMENT ไม่ใช่ data.productLine ของ template เก่า
    return findOne(result.insertId);
}

// Brands ต้องการแค่ GET จึงเพิ่มเพียง 2 ฟังก์ชันในไฟล์เดิม
export async function findAllBrands() {
    const [rows] = await db.query('SELECT * FROM brands ORDER BY id');
    return rows;
}

export async function findBrandById(id) {
    const [rows] = await db.query('SELECT * FROM brands WHERE id = ?', [id]);
    return rows[0] ?? null;
}
