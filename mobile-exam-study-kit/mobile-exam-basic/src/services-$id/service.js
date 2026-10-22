import * as repo from '../repositories-$id/product.repo.js';
import { AppError } from '../middlewares-$id/error-handler.js';

// helper เล็ก ๆ อยู่ใน service เดิม ไม่เพิ่มโฟลเดอร์ validator หรือ class ใหม่
function prepareData(body, creating) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        throw new AppError('Request body must be an object', 400);
    }
    const fields = [
        'sku', 'name', 'brand_id', 'category', 'price', 'ram_gb',
        'storage_gb', 'color', 'stock_quantity', 'status', 'release_date'
    ];
    const data = {};
    // ไม่รับ id, created_at, updated_at หรือชื่อ column อิสระจากผู้ใช้
    for (const key of Object.keys(body)) {
        if (!fields.includes(key)) throw new AppError(`Unknown field: ${key}`, 400);
        data[key] = body[key];
    }
    if (Object.keys(data).length === 0) throw new AppError('Body must not be empty', 400);

    // POST ต้องมี field ที่ DB ไม่ได้กำหนด default; release_date เป็น nullable
    // PUT ไม่บังคับครบ เพราะชุดทดสอบส่งเพียง name/price/stock_quantity
    const required = ['sku', 'name', 'brand_id', 'category', 'price', 'ram_gb', 'storage_gb', 'color'];
    if (creating) {
        for (const key of required) {
            if (data[key] === undefined || data[key] === null || data[key] === '') {
                throw new AppError(`${key} is required`, 400);
            }
        }
    }
    for (const key of ['sku', 'name', 'category', 'color', 'status']) {
        if (data[key] !== undefined) {
            if (typeof data[key] !== 'string' || data[key].trim() === '') {
                throw new AppError(`${key} must be a non-empty string`, 400);
            }
            data[key] = data[key].trim();
        }
    }
    // รับ JSON number จริง; ค่า stock=0 และ price=0 ใช้ได้ในตัวอย่างนี้
    for (const key of ['brand_id', 'price', 'ram_gb', 'storage_gb', 'stock_quantity']) {
        if (data[key] !== undefined) {
            if (typeof data[key] !== 'number' || !Number.isFinite(data[key]) || data[key] < 0) {
                throw new AppError(`${key} must be a non-negative number`, 400);
            }
            if (key !== 'price' && !Number.isSafeInteger(data[key])) {
                throw new AppError(`${key} must be an integer`, 400);
            }
        }
    }
    return data;
}

export async function getObject(id) {
    // await ให้ได้ entity/null ก่อนตรวจ ไม่ตรวจ Promise ด้วย if โดยตรง
    const object = await repo.findOne(id);
    if (!object) throw new AppError(`Product ${id} is not found`, 404);
    return object;
}

export async function getAllObjects(pagination) {
    // คืน {rows,total} ตามรูปแบบ repository เดิม; route นำ rows ไป map DTO
    return repo.findAll(pagination);
}

export async function updateObject(id, data) {
    // เช็ก ID ก่อนแก้; ส่งค่าเดิมซ้ำก็ไม่เข้าใจผิดว่าไม่พบ ID
    await getObject(id);
    const productData = prepareData(data, false);
    const updated = await repo.update(id, productData);
    if (!updated) throw new AppError(`Product ${id} is not found`, 404);
    return updated;
}

export async function removeObject(id) {
    await getObject(id);
    const removed = await repo.remove(id);
    if (!removed) throw new AppError(`Product ${id} is not found`, 404);
    return removed;
}

export async function createObject(data) {
    const productData = prepareData(data, true);
    // SKU ซ้ำหรือ brand_id ไม่มีจริงจะ throw จาก DB ไป error handler
    return repo.create(productData);
}
