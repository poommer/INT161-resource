// ทดสอบ service แบบอ่านอย่างเดียว ไม่ลบสินค้าเดิมเหมือนตัวอย่างเก่า
import * as service from './services-$id/service.js';
import db from './configs-$id/db-config.js';

try {
    const product = await service.getObject(1);
    console.log(product);
} catch (err) {
    console.log(err.message);
} finally {
    // script ทดสอบจบแล้วจึงปิด pool; app.js ของ server ไม่ปิดทุก request
    await db.end();
}
