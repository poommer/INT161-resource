import * as repo from '../repositories-$id/brand.repo.js';
import { AppError } from '../middlewares-$id/error-handler.js';

export async function getObject(id) {
    const object = await repo.findOne(id);
    if (!object) throw new AppError(`Brand ${id} is not found`, 404);
    return object;
}

export function getAllObjects() {
    // ส่ง Promise ต่อให้ route await ได้ ไม่ต้องเขียน async ซ้ำทุกฟังก์ชัน
    return repo.findAll();
}
