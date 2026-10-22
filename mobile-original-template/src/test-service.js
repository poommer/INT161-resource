// ทดสอบอ่านข้อมูลอย่างเดียว ไม่ลบสินค้าเดิมโดยอัตโนมัติ
import * as service from './services-$id/service.js';
import db from './configs-$id/db-config.js';

try {
    const object = await service.getObject(1);
    console.log(object);
} catch (err) {
    console.log(err.message);
} finally {
    await db.end(); // ใช้ตอน script จบ ไม่ปิด pool ทุก request ของ server
}
