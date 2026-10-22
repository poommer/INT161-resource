// 68130500075 - ตัวอย่างฝึก Mobile Distributor
import express from 'express';
import { errorHandler, AppError } from './middlewares-$id/error-handler.js';
import { apiResponse } from './mappers-$id/api-response.js';
import brandRouter from './routes-$id/brand.route.js';
import productRouter from './routes-$id/route.js';

const app = express();
// ต้องอยู่ก่อน routes เพื่อให้ POST/PUT อ่าน req.body เป็น object ได้
app.use(express.json());

const STUDENT_ID = '68130500075';
const BASE_URL = `/api/${STUDENT_ID}`;

app.get(`${BASE_URL}/student-info`, (req, res) => {
    // ใช้ชื่อตาม Student Profile ที่ผู้ใช้ยืนยัน ไม่ใช้ชื่อที่ผิดใน JSON ตัวอย่าง
    const student = {
        studentId: STUDENT_ID,
        name: 'Siripoom Limesoontorn',
        secretKey: '67KaSu'
    };
    // helper เพิ่ม success และ timestamp ปัจจุบัน ไม่ hard-code เวลาในตัวอย่าง
    return apiResponse(res, student);
});

// path ใน router จะต่อจาก prefix นี้ เช่น router.get('/') → /api/ID/products
app.use(`${BASE_URL}/brands`, brandRouter);
app.use(`${BASE_URL}/products`, productRouter);

// ไม่มี route ตรงคำขอ ให้ส่ง 404 ผ่าน error handler เดียวกัน
app.use((req, res, next) => {
    next(new AppError('Route not found', 404));
});
app.use(errorHandler);

app.listen(3000, () => {
    console.log(`API ready: http://localhost:3000${BASE_URL}`);
});
