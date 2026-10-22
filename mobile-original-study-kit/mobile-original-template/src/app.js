// 68130500075 - Siripoom Limesoontorn
import express from 'express';
import productRouter from './routes-$id/route.js';

const app = express();
app.use(express.json()); // ต้องอยู่ก่อน router ที่อ่าน req.body

const STUDENT_ID = '68130500075';
const BASE_URL = `/api/${STUDENT_ID}`;

app.get(`${BASE_URL}/student-info`, (req, res) => {
    // ใช้ชื่อที่ผู้ใช้ยืนยันตาม Student Profile
    return res.json({
        success: true,
        data: {
            studentId: STUDENT_ID,
            name: 'Siripoom Limesoontorn',
            secretKey: '67KaSu'
        },
        timestamp: new Date().toISOString()
    });
});

// ใช้ router เดิมไฟล์เดียว รวม /brands และ /products ภายใต้ base นี้
app.use(BASE_URL, productRouter);

// ถ้าไม่ match route ใด ให้ส่งเข้า error middleware ด้านล่าง
app.use((req, res, next) => {
    const err = new Error('Route not found');
    err.statusCode = 404;
    next(err);
});

app.listen(3000, () => {
    console.log(`API ready: http://localhost:3000${BASE_URL}`);
});

// เติม error middleware ตำแหน่งเดิมของ template ไม่แยกไฟล์ error-handler.js
// ต้องมี 4 arguments และอยู่หลัง routes
app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    let status = err.statusCode || err.status || 500;
    let code = 'REQUEST_ERROR';
    let message = err.message;

    if (err.type === 'entity.parse.failed') {
        status = 400;
        code = 'INVALID_JSON';
        message = 'Request body is not valid JSON';
    } else if (err.code === 'ER_DUP_ENTRY') {
        status = 409;
        code = 'DUPLICATE_KEY';
        message = 'SKU already exists';
    } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        status = 400;
        code = 'FOREIGN_KEY_NOT_FOUND';
        message = 'Brand does not exist';
    } else if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        status = 409;
        code = 'RESOURCE_IN_USE';
        message = 'Resource is referenced by other records';
    }
    if (status === 500) {
        console.error(err); // เก็บรายละเอียดที่ server ไม่ส่ง SQL/stack ให้ client
        code = 'INTERNAL_SERVER_ERROR';
        message = 'An unexpected error occurred';
    }
    return res.status(status).json({
        success: false,
        error: { code, message },
        timestamp: new Date().toISOString()
    });
});
