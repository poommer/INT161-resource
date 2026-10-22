# Mobile Exam — ฉบับ template เริ่มต้น

ใช้ node-express-esm-template 2 ตามที่ยืนยัน • โค้ดพื้นฐานพร้อม comment ภาษาไทย • 22 ตุลาคม 2026

## 1. โครงสร้างที่คงไว้

ฉบับนี้เริ่มจาก template เริ่มต้นจริง ไม่ใช้โครงสร้าง mockup ที่แยก brand.repo/product.repo และไม่เพิ่ม source file ใด ๆ เก็บ error-handling middleware ที่ app.js เหมือนตำแหน่งเดิมและเติมให้ทำงานครบ

```text
mobile-original-template/
  npm
  package.json
  package-lock.json
  src/
    app.js                              ← ประกอบ app + identity + error handler
    test-service.js                     ← script อ่านสินค้า 1 รายการ
    configs-$id/
      db-config.js                      ← MySQL pool
    repositories-$id/
      repository.js                     ← SQL ของ products และ brands
    services-$id/
      service.js                        ← ตรวจ input/not found และแปลง DTO
    routes-$id/
      route.js                          ← ทุก route ของ brands/products
    mappers-$id/
      entity-dto-mapper.js               ← Summary/Detail และ map/maps
      api-response.js                   ← success/paginate helper
    middlewares-$id/
      pagination-middleware.js          ← queryParser()
```

คงไฟล์ทั้งหมด 12 ไฟล์ที่เกี่ยวข้อง รวม JavaScript 9 ไฟล์ คง package.json, package-lock.json และไฟล์ npm ว่างตามเดิม แก้เฉพาะเนื้อหาของ source ที่ต้องเติมให้ตรงโจทย์ ไม่มี errors/, validators/, error-handler.js, brand.route.js หรือ product.repo.js เพิ่มเข้ามา

ไม่แก้ template ต้นฉบับใน Downloads เก็บโค้ดที่เติมแล้วเป็นสำเนาใน mobile-original-template ส่วน SQL, ใบงาน และ tester เดิมอยู่แยกที่ mobile-original-support ไม่ปะปนเข้าโครงสร้าง template

## 2. Error handling ยังคงทำงาน

ที่ service.js มี AppError class เล็ก ๆ ภายในไฟล์ ใช้ new AppError(message,statusCode) เพื่อส่งสถานะที่ตั้งใจตอบ เช่น 400/404 ไม่ export/import กลับไปหา app.js จึงไม่มีวงจร import

ที่ app.js เติม middleware เดิม (err,req,res,next) ให้รับ error จาก async route ของ Express 5 แล้วตอบ JSON:

| เหตุการณ์ | status | ใครตรวจ |
| --- | --- | --- |
| ไม่พบสินค้า/แบรนด์ | 404 | service ตรวจ entity ก่อน mapper |
| body ว่าง/field ไม่อนุญาต/ชนิดข้อมูลผิดตามกติกาพื้นฐาน | 400 | prepareData ใน service |
| JSON syntax ผิด | 400 | express.json → error handler |
| SKU ซ้ำ | 409 | UNIQUE ใน DB → error handler |
| brand_id ไม่มีจริง | 400 | Foreign Key ใน DB → error handler |
| ลบข้อมูลที่ถูกอ้างอิงและ DB ปฏิเสธ | 409 | DB → error handler |
| error อื่นที่ไม่คาดหมาย | 500 | log ฝั่ง server และส่งข้อความทั่วไป |

```text
Repository ส่ง SQL → DB throw Error
                  ↓
Service/Route ที่ await ได้ rejected Promise
                  ↓
Express 5 ส่งไป error middleware ใน app.js
                  ↓
res.status(...).json({success:false,error:...,timestamp:...})
```

error middleware วางหลัง routes และยังอยู่ท้าย app.js ตาม template แม้ listen() อยู่ก่อน middleware ในไฟล์ ก็ลงทะเบียน middleware ครบในช่วงเริ่มโปรแกรมก่อนรับ request ตาม flow ปกติ

## 3. วิธีรัน

ใน ZIP สำหรับอ่านฝึกมีโฟลเดอร์ project และ support วางเป็นโฟลเดอร์ข้างกัน:

```text
mobile-original-template/
mobile-original-support/
  init-database.sql
  exam-spec-68130500075.md
  tests/test-runner.mjs
mobile-original-guide.html
mobile-original-guide.md
mobile-original-requests.http
mobile-original-verification.json
```

เปิด terminal ใน mobile-original-template แล้วเตรียม dependencies ขณะอนุญาตใช้อินเทอร์เน็ต:

```sh
npm ci
node src/app.js
```

package เดิมไม่มี start script จึงไม่ใช้ npm start และ npm test เดิมเป็น placeholder ไม่ใช่ tester ข้อสอบ อย่าแก้ scripts หากต้องการคง package ตามชุดนี้

ก่อนเปิด API ต้องเตรียม MySQL และแก้ host/user/password ใน src/configs-$id/db-config.js ให้ตรงเครื่อง database คือ mobile_distributor ค่า password ที่ใส่ไว้เป็นค่าฝึกจาก mockup ไม่ใช่ค่ารับรองของเครื่องสอบ

SQL ต้นฉบับอยู่ที่ support และมี DROP TABLE/TRUNCATE ซึ่งล้างข้อมูลเดิม ใช้เฉพาะฐานข้อมูลฝึกที่ตั้งใจ reset แล้วจึงรันจากโฟลเดอร์ project:

```sh
mysql -u root -p < ../mobile-original-support/init-database.sql
```

เปิด terminal อีกหน้าที่โฟลเดอร์ project ขณะ server ทำงาน แล้วรัน tester เดิม:

```sh
node ../mobile-original-support/tests/test-runner.mjs 68130500075
```

หากใช้ ZIP เฉพาะ project ต้องนำ support ไปวางข้างกันเองหากต้องการใช้คำสั่งนี้ tester ไม่ได้เป็นส่วนหนึ่งของ template เริ่มต้นจึงไม่ย้ายเข้า project

## 4. ทุก endpoint ใช้ไฟล์เดิม

app.js mount router ที่ /api/68130500075 ส่วน route.js มี path /brands และ /products จึงรวมเป็น URL จริงตามตาราง:

| Method | URL | ผล |
| --- | --- | --- |
| GET | /api/68130500075/student-info | 200 ข้อมูลผู้สอบ |
| GET | /api/68130500075/brands | 200 แบรนด์ทั้งหมด |
| GET | /api/68130500075/brands/:id | 200/404 |
| GET | /api/68130500075/products?page=1&limit=10 | 200 Summary DTO + Pagination |
| GET | /api/68130500075/products/:id | 200 Detail DTO หรือ 404 |
| POST | /api/68130500075/products | 201 หรือ SKU ซ้ำ 409 |
| PUT | /api/68130500075/products/:id | 200 หรือ 404 |
| DELETE | /api/68130500075/products/:id | 204 ไม่มี body หรือ 404 |

student-info ใช้ชื่อ Siripoom Limesoontorn ตามที่ผู้ใช้ยืนยัน รหัสและ Secret Key ตามใบงาน ไม่ใช้ชื่อที่ขัดกันใน JSON ตัวอย่าง

## 5. Flow รายการและ Pagination ตามรูปแบบ template

```http
GET /api/68130500075/products?page=2&limit=10
```

1. queryParser ตรวจ/แปลงค่าแล้วแนบ {page:2,limit:10,offset:10}
2. route ส่ง req.pagination เข้า service.getAllObjects
3. repository.findAll ใช้ LIMIT 10 OFFSET 10 และ COUNT(*) ได้ 75 บน seed ใหม่
4. repository คืน rows ซึ่งเป็น array และแนบ rows.totalItems=75
5. service เรียก mapper.maps(rows,'summary')
6. mapper แปลงแต่ละ entity และคัดลอก totalItems ไปยัง array ที่แปลงแล้ว
7. route ส่ง DTO array กับ req.pagination ให้ apiResponse
8. paginate helper อ่าน data.totalItems เพื่อสร้าง total/totalPages/hasNextPage/hasPrevPage
9. JSON ส่ง data เป็น array และส่งยอดใน pagination แยกกัน

Property totalItems ของ array ใช้งานใน JavaScript ได้แต่ JSON.stringify ของ array ไม่ส่ง property ที่ไม่ใช่ index ออกมาเป็น JSON field จึงต้องอ่านไปใส่ metadata ก่อนส่งแบบนี้

ยอด 0 ต้องไม่หาย จึงใช้เงื่อนไข entities.totalItems !== undefined ใน mapper แทน if(totalItems) ของ template เดิม

ค่าเริ่มต้นตัวอย่าง page=1, limit=20 สูงสุด 100 และใช้ limit หลัง cap คำนวณ offset รายการแบ่งหน้าเสมอเพื่อใช้กับใบงานนี้ ต่างจาก middleware เริ่มต้นที่ปิด pagination เมื่อส่ง page/limit ไม่ครบ ต้องปรับ policy ตามโจทย์จริง

## 6. Flow รายตัวและ DTO

service.getObject(id) อ่าน entity จาก repository, ตรวจ null แล้วจึง mapper.map(entity,'full') ตามแนว service ที่มี mapper อยู่แล้วใน template เริ่มต้น Route ไม่ต้อง map ซ้ำ

Summary มี 7 fields: id, sku, name, brandId, category, price, status

Detail เพิ่ม brandName, ramGb, storageGb, color, stockQuantity, releaseDate ชื่อแบรนด์ได้จาก JOIN brands และ alias brand_name ไม่ได้อยู่ในตาราง products โดยตรง

Input POST/PUT ยังใช้ brand_id, ram_gb, storage_gb, stock_quantity, release_date ตามใบงาน อย่านำ response DTO camelCase ส่งกลับเป็น body โดยไม่แปลง

## 7. POST, PUT และ DELETE

POST: prepareData ตรวจ input/whitelist → INSERT ... SET ? → อ่านกลับด้วย result.insertId → Full DTO → 201 เพราะ schema มือถือใช้ id AUTO_INCREMENT ไม่ใช้ productLine/productCode จากตัวอย่าง entity เก่า

PUT: ตรวจว่ามี ID → ตรวจเฉพาะ field ที่ส่ง → UPDATE ... SET ? WHERE id=? → อ่านกลับ → Full DTO → 200 รองรับส่งบาง field ตาม test-runner เช่น name/price/stock_quantity ไม่บังคับส่งครบทุก field แบบคู่มือ Products รุ่นก่อน

DELETE: ตรวจ ID → DELETE → ตรวจ affectedRows → 204 ด้วย res.end() การลบสำเร็จไม่มี JSON body หลังลบ GET ต้องได้ 404

prepareData เป็น helper ใน service.js เดิมและคัด field ที่อนุญาตก่อนใช้ SET ? ไม่เพิ่มไฟล์ validator การตรวจตั้งใจให้พื้นฐาน ไม่ใช่ schema validation เต็มรูปแบบสำหรับทุก max length/date/decimal precision

## 8. Signature ที่ต้องใช้ให้ตรง

| ฟังก์ชัน | ตัวอย่าง |
| --- | --- |
| AppError อยู่ใน service.js | new AppError('Product not found',404) |
| apiResponse คง 4 arguments | apiResponse(res,data,pagination,status) |
| POST response | apiResponse(res,object,null,201) |
| Product list | getAllObjects(req.pagination) → DTO array ที่มี totalItems |
| Product item | getObject(req.params.id) → Full DTO |
| Update | updateObject(req.params.id,req.body) |
| Brands | getAllBrands(), getBrand(id) ใน service เดิม |

อย่านำการคืน {rows,total} จาก mockup หรือ signature 5 arguments จากตัวอย่างฝึกก่อนหน้ามาปนกับฉบับนี้ เพราะฉบับนี้ยึด array/totalItems และ helper 4 arguments ของ template เริ่มต้น

## 9. ผลตรวจและขอบเขต

ตรวจว่าไฟล์ที่เกี่ยวข้องทั้ง 12 ไฟล์ตรงกับรายการใน template เริ่มต้น ไม่มีชื่อไฟล์เพิ่ม/หาย และ package.json/package-lock.json/npm คงเดิมแบบ byte-for-byte

ตรวจ syntax ของ JavaScript 9 ไฟล์ ใช้ Express handlers จริงภายในโปรเซสกับข้อมูล DB จำลองจาก SQL: tester เดิมผ่าน 12/12 กรณี และตรวจเพิ่ม 9 กรณี ได้แก่ชื่อผู้สอบ DTO fields/type, JOIN/date, หน้าว่าง, partial PUT, error input/FK, pagination, total=0 และ error 500 ใน app.js

ยังไม่ได้เชื่อม MySQL จริงหรือรัน SQL initialization ผลนี้จึงไม่ใช่คะแนนสอบจริงหรือการยืนยันว่า config/SQL/timezone ทำงานตรงเครื่องสอบ ต้องลอง API กับ DB จริงตามขั้นตอนก่อนใช้งาน

COUNT/SELECT และ existence/UPDATE เป็น query แยก ไม่เพิ่ม transaction เพื่อทำตัวอย่างพื้นฐาน Schema และจำนวนข้อมูลอ้าง SQL ที่ได้รับ แต่ไม่ได้ดัดแปลง SQL หรือเกณฑ์ tester เพื่อให้ผ่าน

## 10. โค้ดเต็มพร้อมคำอธิบาย

โค้ดในแต่ละหัวข้อด้านล่างตรงกับไฟล์ใน mobile-original-template ทุกไฟล์ JavaScript โค้ด comment อธิบายจุดที่ต้องเติมและเหตุผล ใช้ editor ค้นชื่อฟังก์ชันหรือค้นข้อความใน browser ได้

### 10.1 src/app.js

```js
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
```

### 10.2 src/configs-$id/db-config.js

```js
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
```

### 10.3 src/routes-$id/route.js

```js
import * as service from '../services-$id/service.js';
import express from 'express';
import { apiResponse } from '../mappers-$id/api-response.js';
import { queryParser } from '../middlewares-$id/pagination-middleware.js';

// Router เดิมไฟล์เดียว รวม endpoints ทั้งแบรนด์และสินค้า
const router = express.Router();

router.get('/brands', async (req, res) => {
    const objects = await service.getAllBrands();
    return apiResponse(res, objects);
});

router.get('/brands/:id', async (req, res) => {
    const object = await service.getBrand(req.params.id);
    return apiResponse(res, object);
});

router.get('/products', queryParser(), async (req, res) => {
    const objects = await service.getAllObjects(req.pagination);
    // Service แปลง DTO และเก็บ totalItems ไว้แล้ว ไม่ map ซ้ำที่ route
    return apiResponse(res, objects, req.pagination);
});

router.get('/products/:id', async (req, res) => {
    const object = await service.getObject(req.params.id);
    return apiResponse(res, object);
});

router.post('/products', async (req, res) => {
    const object = await service.createObject(req.body);
    return apiResponse(res, object, null, 201);
});

router.put('/products/:id', async (req, res) => {
    // เติม argument ที่ template เดิมยังไม่ได้ส่ง
    const object = await service.updateObject(req.params.id, req.body);
    return apiResponse(res, object);
});

router.delete('/products/:id', async (req, res) => {
    await service.removeObject(req.params.id);
    return res.status(204).end();
});

export default router;
```

### 10.4 src/services-$id/service.js

```js
import * as repo from '../repositories-$id/repository.js';
import mapper from '../mappers-$id/entity-dto-mapper.js';

// วางคลาสเล็กใน service เดิม ไม่เพิ่มไฟล์ error ใหม่ และไม่ import กลับจาก app.js
// argument เหมือนตัวอย่างก่อน: message ก่อน statusCode
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

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
    const object = await repo.findOne(id);
    if (!object) throw new AppError(`Product ${id} is not found`, 404);
    // คงแนว template: Service แปลง Entity → DTO ก่อนคืนให้ Route
    return mapper.map(object, 'full');
}

export async function getAllObjects(pagination) {
    const objects = await repo.findAll(pagination);
    // mapper.maps ต้องคัดลอก totalItems ไปด้วย แม้ยอดเป็น 0
    return mapper.maps(objects, 'summary');
}

export async function updateObject(id, data) {
    // ตรวจ ID ก่อน UPDATE; ส่งค่าเดิมซ้ำก็ไม่เข้าใจผิดว่า ID ไม่มี
    await getObject(id);
    const productData = prepareData(data, false);
    const object = await repo.update(id, productData);
    if (!object) throw new AppError(`Product ${id} is not found`, 404);
    return mapper.map(object, 'full');
}

export async function removeObject(id) {
    await getObject(id);
    const removed = await repo.remove(id);
    if (!removed) throw new AppError(`Product ${id} is not found`, 404);
    return removed;
}

export async function createObject(data) {
    const productData = prepareData(data, true);
    const object = await repo.create(productData);
    return mapper.map(object, 'full');
}

// แบรนด์คืน raw rows ตามตัวอย่าง JSON ของใบงาน ไม่ใช้ product mapper
export async function getAllBrands() {
    return repo.findAllBrands();
}

export async function getBrand(id) {
    const object = await repo.findBrandById(id);
    if (!object) throw new AppError(`Brand ${id} is not found`, 404);
    return object;
}
```

### 10.5 src/repositories-$id/repository.js

```js
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
```

### 10.6 src/mappers-$id/entity-dto-mapper.js

```js
// คงชื่อ EntityDtoMapper และไฟล์เดิม แก้ field ให้ตรง schema มือถือ
export default class EntityDtoMapper {
    static toSummaryDTO(entity) {
        // ส่งเฉพาะ 7 field ตามโจทย์ ไม่มี timestamps/รายละเอียดแฝง
        return {
            id: entity.id,
            sku: entity.sku,
            name: entity.name,
            brandId: entity.brand_id,
            category: entity.category,
            price: Number(entity.price),
            status: entity.status
        };
    }

    static toDetailDTO(entity) {
        return {
            id: entity.id,
            sku: entity.sku,
            name: entity.name,
            brandId: entity.brand_id,
            brandName: entity.brand_name, // SQL JOIN และตั้ง alias มาให้
            category: entity.category,
            price: Number(entity.price),
            ramGb: entity.ram_gb,
            storageGb: entity.storage_gb,
            color: entity.color,
            stockQuantity: entity.stock_quantity,
            status: entity.status,
            releaseDate: entity.release_date
        };
    }

    static map(entity, viewType) {
        if (viewType === 'summary') return this.toSummaryDTO(entity);
        return this.toDetailDTO(entity);
    }

    static maps(entities, viewType) {
        let entitiesMap;
        if (viewType === 'full') {
            entitiesMap = entities.map(item => this.toDetailDTO(item));
        } else {
            entitiesMap = entities.map(item => this.toSummaryDTO(item));
        }
        // ห้ามใช้ if(totalItems) เพราะ 0 เป็น falsy ทำให้ยอดหาย
        if (entities.totalItems !== undefined) {
            entitiesMap.totalItems = entities.totalItems;
        }
        return entitiesMap;
    }
}
```

### 10.7 src/mappers-$id/api-response.js

```js
import httpStatus from 'http-status';

// คงลายเซ็น 4 arguments และแยก success/paginate แบบ template เดิม
export async function apiResponse(res, data, pagination = null, status = httpStatus.OK) {
    return await (pagination
        ? paginate(res, data, pagination, Number(status))
        : success(res, data, Number(status)));
}

async function success(res, data, statusCode) {
    return res.status(statusCode).json({
        success: true,
        data: data,
        timestamp: new Date().toISOString()
    });
}

async function paginate(res, data, pagination, statusCode) {
    const { limit, page } = pagination;
    // จำนวนทั้งหมดเดินทางมากับ array จาก Repository → Mapper → helper
    const total = data.totalItems;
    return res.status(statusCode).json({
        success: true,
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1
        },
        timestamp: new Date().toISOString()
    });
}
```

### 10.8 src/middlewares-$id/pagination-middleware.js

```js
// คงรูปแบบ middleware factory queryParser() ตาม template
export const queryParser = () => {
    return (req, res, next) => {
        // ตามโจทย์รายการใช้ pagination เสมอ: page=1, limit=20 เป็น default ของตัวอย่าง
        const { page = '1', limit = '20' } = req.query || {};
        const parsedPage = Number(page);
        const parsedLimit = Number(limit);
        // ตัวอย่างนี้ใช้นโยบาย fallback: ค่าผิดใช้ default แทน throw; template เริ่มต้นเดิมจะปิด pagination ถ้าส่งไม่ครบ
        // Number ต่างจาก parseInt ตรงที่ไม่รับ '2abc' เป็นเลข 2
        req.pagination = {
            page: Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1,
            limit: Number.isSafeInteger(parsedLimit) && parsedLimit > 0
                ? Math.min(parsedLimit, 100)
                : 20
        };
        // ใช้ limit หลัง cap แล้ว เช่น page=2, limit=200 → offset=100
        req.pagination.offset = (req.pagination.page - 1) * req.pagination.limit;
        // ป้องกันเลขหน้าที่ทำให้ผลคูณเกินช่วงจำนวนเต็มที่แทนได้แน่นอน
        if (!Number.isSafeInteger(req.pagination.offset)) {
            req.pagination.page = 1;
            req.pagination.offset = 0;
        }
        next();
    };
};
```

### 10.9 src/test-service.js

```js
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
```
