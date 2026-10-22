# ตัวอย่างข้อสอบ Mobile Distributor แบบพื้นฐาน

อิง exam-spec-68130500075.md + init-database.sql และ source ใน int161-exam1-mockup • 22 ตุลาคม 2026

## 1. สิ่งที่คงตาม template

ตัวอย่างนี้ใช้โครงสร้างไฟล์ของ mockup ที่ให้มาล่าสุด ไม่ใช้โครงสร้างโปรเจกต์ฝึก Products รุ่นก่อนหน้า และไม่เพิ่ม class/โฟลเดอร์ validator/errors ใหม่ คงชื่อ folder $id ตามที่ได้รับ ไม่เปลี่ยนเป็นรหัสนักศึกษาเอง

- ชื่อและตำแหน่งไฟล์ใน src เหมือนต้นฉบับทุกไฟล์
- package.json และ package-lock.json คงเดิมทุก byte ไม่เพิ่ม dependencies หรือ scripts
- init-database.sql และใบงานคงต้นฉบับ ไม่เปลี่ยน schema/seed
- tests/test-runner.mjs และ tests/batch-grade.mjs คงเดิม ไม่แก้ assertions หรือเกณฑ์คะแนน
- เติม/แก้เนื้อหาในไฟล์เดิมเพื่อให้ทำงานตามโจทย์ พร้อม comment อธิบาย
- ไม่มี node_modules หรือผลสอบเก่าปะปนใน ZIP

“คง template” ในชุดนี้หมายถึงคงโครงสร้างไฟล์และรูปแบบการเรียกหลัก แต่เติม logic ภายในตามโจทย์ เช่น timestamp ปัจจุบัน, DTO และการจัดการ error ไม่ได้หมายถึงเก็บ placeholder/โค้ดที่ใช้กับ entity เก่าทั้งหมดไว้โดยไม่เติม

ชื่อ student-info ใช้ Siripoom Limesoontorn ตาม Student Profile และคำยืนยันของผู้ใช้ เพราะชื่อใน JSON ตัวอย่างไม่ตรงกัน รหัส/Secret Key ใช้ค่าของใบงาน ไม่พิมพ์ Secret Key ใน server log

## 2. โครงสร้างโปรเจกต์ที่ใช้

```text
mobile-exam-basic/
  package.json                     ← เดิม ไม่มี start script
  package-lock.json                ← เดิม
  init-database.sql                ← เดิม: schema + seed
  exam-spec-68130500075.md          ← ใบงานเดิม
  tests/
    test-runner.mjs                 ← tester เดิม
    batch-grade.mjs                 ← เดิม ไม่จำเป็นต้องใช้ฝึกคนเดียว
  src/
    app.js
    test-service.js
    configs-$id/
      db-config.js
    repositories-$id/
      brand.repo.js
      product.repo.js
    services-$id/
      brand.service.js
      service.js
    routes-$id/
      brand.route.js
      route.js
    mappers-$id/
      api-response.js
      product-mapper.js
      entity-dto-mapper.js          ← ไฟล์เก่าที่ไม่ได้ใช้ใน API นี้
    middlewares-$id/
      pagination-middleware.js
      error-handler.js             ← AppError อยู่ที่นี่ตาม template
```

เอกสารอธิบายและ requests.http วางนอกโฟลเดอร์โปรเจกต์ เพื่อไม่เพิ่มไฟล์ในโครงสร้าง src ของ template

## 3. วิธีรันจากไฟล์ที่คงเดิม

เปิด terminal ในโฟลเดอร์ mobile-exam-basic ไม่ใช่โฟลเดอร์ชั้นนอกของ ZIP

```sh
npm ci
node src/app.js
```

package.json เดิมไม่มี npm start จึงใช้ node src/app.js แทน ไม่ได้เพิ่ม script เพื่อให้เป็นไปตามคำขอคง template ส่วน npm test เดิมเป็นข้อความ placeholder ไม่ใช่ชุดตรวจข้อสอบ

ก่อนเปิด server ต้องเตรียม MySQL และตั้งค่า src/configs-$id/db-config.js ให้ตรงเครื่อง คง host/user/password default จากไฟล์เดิมไว้ให้แก้ได้ง่าย database ต้องเป็น mobile_distributor

การสร้างฐานข้อมูลใช้ไฟล์ init-database.sql ที่ root ของโปรเจกต์:

```sh
mysql -u root -p < init-database.sql
```

ไฟล์ SQL นี้มี DROP TABLE/TRUNCATE และสร้าง seed ใหม่ 22 brands/75 products จึงใช้กับฐานข้อมูลฝึกที่ตั้งใจให้ reset เท่านั้น ตัวอย่างนี้ไม่ได้รัน SQL นี้กับฐานข้อมูลของผู้ใช้

จากนั้นเปิด terminal อีกหน้าในโฟลเดอร์เดิมเพื่อรัน tester:

```sh
node tests/test-runner.mjs 68130500075
```

ไม่จำเป็นต้องแก้ tester หากไม่มี student.csv tester เดิมจะใช้ Unknown Student/N/A ในข้อมูลคาดหวัง จึงอาจไม่ตรวจชื่อ/Secret Key ครบ แม้ endpoint ของตัวอย่างใส่ค่าตามใบงานแล้ว อย่าสร้าง roster ปลอมเพื่อให้ผลคะแนนดูครบ

## 4. Flow ที่ใช้ทั้งโปรเจกต์

```text
Request
 → app.js (express.json และ base path)
 → Router (อ่าน params/query/body)
 → Service (ตรวจ input/ตรวจ not found)
 → Repository (SQL ด้วย mysql2)
 → DB คืน rows/result
 → Router ใช้ ProductMapper แปลง DTO
 → apiResponse ส่ง success/data/timestamp/pagination

ถ้า throw หรือ Promise reject ใน async route ของ Express 5
 → errorHandler ส่ง success:false พร้อม error และ timestamp
```

ใน template mockup นี้ route เป็นผู้เรียก mapper จึงคงแนวทางนั้น ไม่ย้าย mapper ไปอยู่ service ทั้งหมดเพียงเพื่อให้เหมือนตัวอย่างก่อนหน้า

## 5. แต่ละไฟล์ทำอะไร

| ไฟล์ | งานหลัก | สิ่งที่จำไปปรับใช้ได้ |
| --- | --- | --- |
| app.js | สร้าง app, parse JSON, mount base path, identity, error handler | ลง middleware ให้ถูกลำดับ |
| db-config.js | MySQL Promise pool | database ให้ตรง SQL; decimalNumbers/dateStrings |
| brand.repo.js | SELECT brands ทั้งหมด/ตาม ID | [rows] แล้วเลือก rows[0] |
| product.repo.js | COUNT, SELECT+JOIN, INSERT, UPDATE, DELETE | placeholders และ result.insertId |
| brand.service.js | เรียก repo และ throw 404 | ตรวจ null ก่อนส่ง response |
| service.js | product CRUD และ helper prepareData | ตรวจ body, whitelist fields, partial update |
| product-mapper.js | Summary/Detail DTO | snake_case → camelCase |
| api-response.js | envelope และ metadata | ลายเซ็นเดิม (res,data,pagination,status) |
| pagination-middleware.js | page/limit/offset | defaults และ cap limit ก่อนคำนวณ offset |
| route.js | HTTP endpoints สินค้า | ส่ง id/body ให้ service ครบ, await ก่อนตอบ |
| brand.route.js | GET brands | ใช้ service และ helper เดียวกัน |
| error-handler.js | AppError และ MySQL error mapping | constructor(message,statusCode) ตามไฟล์เดิม |
| test-service.js | อ่านสินค้ารหัส 1 แล้วปิด pool | เปลี่ยน import เก่าที่ไม่มีจริง; ไม่มีคำสั่งลบข้อมูลฝึกอัตโนมัติ |

entity-dto-mapper.js เป็นตัวอย่าง productCode/MSRP ของ entity เก่า คงไว้ไม่เปลี่ยนและไม่มีไฟล์ active import ใช้ สำหรับโจทย์มือถือให้ดู product-mapper.js

## 6. สรุป endpoints ตามใบงาน

ทุก path ขึ้นต้น /api/68130500075

| Method | Path ต่อจาก base | ทำอะไร | สำเร็จ/ผิดพลาดหลัก |
| --- | --- | --- | --- |
| GET | /student-info | รหัส ชื่อ Secret Key ของผู้เข้าสอบ | 200 |
| GET | /brands | แบรนด์ทั้งหมดแบบ raw rows ตามโจทย์ | 200 |
| GET | /brands/:id | แบรนด์หนึ่งรายการ | 200/404 |
| GET | /products?page=1&limit=10 | Summary DTO + Pagination | 200 |
| GET | /products/:id | Detail DTO พร้อมชื่อแบรนด์ | 200/404 |
| POST | /products | เพิ่มสินค้า | 201/409 SKU ซ้ำ |
| PUT | /products/:id | แก้ field ที่ส่งมา | 200/404 |
| DELETE | /products/:id | ลบสินค้า | 204 ไม่มี body/404 |

brand POST/PUT/DELETE เดิมใน template คงตอบ 405 เพราะใบงานไม่ได้ขอให้ทำ CRUD ของ brands

## 7. Pagination — ไล่ค่าที่ส่งผ่านแต่ละชั้น

```http
GET /api/68130500075/products?page=2&limit=10
```

1. queryParser อ่าน string '2'/'10' แล้วแปลง number
2. req.pagination = {page:2,limit:10,offset:10}
3. route ส่ง req.pagination ให้ service.getAllObjects(...)
4. service ส่งต่อ repo.findAll(pagination)
5. COUNT ได้ total=75 บน seed ใหม่
6. SELECT ... ORDER BY id LIMIT 10 OFFSET 10 ได้ลำดับที่ 11–20
7. repo คืน {rows,total:75}
8. route map rows เป็น Summary DTO
9. route รวม total เข้า pagination object แล้วส่ง helper
10. helper คำนวณ totalPages=8, hasNextPage=true, hasPrevPage=true

ไม่มี query ใช้ค่าเริ่มต้นตาม template page=1, limit=20 ไม่เปลี่ยนเป็น 10 เพียงเพราะตัวอย่าง response ใช้ 10 ค่า limit สูงสุด 100 ถ้าระบุค่าไม่ถูกต้องใช้ default ตามนโยบายเดิมของ template

สูตร: offset=(page−1)×limit; totalPages=Math.ceil(total/limit) ค่า offset ต้องใช้ limit หลัง cap แล้ว

## 8. DTO — จำชื่อ input กับ output ให้แยกกัน

| DB/Input | Detail output | Summary output |
| --- | --- | --- |
| id | id | id |
| sku | sku | sku |
| name | name | name |
| brand_id | brandId | brandId |
| brand_name จาก JOIN | brandName | ไม่ส่ง |
| category | category | category |
| price | price แบบ number | price แบบ number |
| ram_gb | ramGb | ไม่ส่ง |
| storage_gb | storageGb | ไม่ส่ง |
| color | color | ไม่ส่ง |
| stock_quantity | stockQuantity | ไม่ส่ง |
| status | status | status |
| release_date | releaseDate | ไม่ส่ง |
| created_at/updated_at | ไม่ส่ง | ไม่ส่ง |

brand_name ไม่ใช่ column ของ products แต่ได้จาก SELECT p.*, b.name AS brand_name JOIN brands b ON b.id=p.brand_id ถ้าไม่มี JOIN จะไม่มีข้อมูล brandName ให้ mapper ส่ง

MySQL DECIMAL อาจกลับมาเป็น string จึงใช้ decimalNumbers และ Number(entity.price) ส่วน DATE ตั้ง dateStrings:['DATE'] เพื่อคง YYYY-MM-DD และไม่เลื่อนวันเมื่อแปลง timezone สำหรับ created_at ของ brands ยังคงเป็น timestamp ที่ driver serialize ตาม config/สภาพแวดล้อม ไม่ hard-code ตามเวลาตัวอย่างในโจทย์

## 9. POST — AUTO_INCREMENT และ SKU ซ้ำ

```json
{
  "sku":"TEST-SKU-999",
  "name":"Test Phone 2026",
  "brand_id":1,
  "category":"FLAGSHIP",
  "price":29900,
  "ram_gb":8,
  "storage_gb":256,
  "color":"Black",
  "stock_quantity":10,
  "status":"AVAILABLE",
  "release_date":"2026-01-01"
}
```

service.prepareData คัดเฉพาะ fields ที่อนุญาต ไม่รับ id หรือ timestamps ที่ผู้ใช้ใส่เอง ไม่เพิ่ม validator class แยกให้ซับซ้อน POST บังคับ fields ที่ DB ไม่ได้ตั้ง default ส่วน stock_quantity/status ใช้ default ของ schema ได้ และ release_date อนุญาต NULL ตามฐานข้อมูล

repo ใช้ db.query('INSERT INTO products SET ?', [data]) ตามแนว template แล้วเอา result.insertId ไป findOne เพราะ id เป็น AUTO_INCREMENT ตัวอย่างนี้ต่างจาก Products ฝึกเก่าที่ใช้ string productCode เป็น key

SKU ซ้ำจะได้ ER_DUP_ENTRY จาก UNIQUE แล้ว error handler แปลงเป็น 409; brand_id ไม่มีจริงจะได้ foreign-key error แล้วตอบ 400

## 10. PUT — แก้เฉพาะ field ที่ส่งมา

```json
{"name":"Updated Phone","price":27900,"stock_quantity":20}
```

test-runner ให้ PUT ส่งเพียง 3 fields จึงต้องรองรับ partial update สำหรับใบงานนี้ ไม่บังคับส่งทุก field เหมือนคู่มือฝึกฉบับก่อน และไม่เปลี่ยน method เป็น PATCH เอง

ลำดับ: getObject(id) ตรวจว่ามีจริง → prepareData(data,false) → UPDATE ... SET ? WHERE id=? → SELECT ข้อมูลหลังแก้ → Detail DTO → 200

SET ? ของ query() ช่วยเปลี่ยนเฉพาะ fields ที่มีใน object ส่วน field ที่ไม่ได้ส่งคงค่าเดิม การยอมให้ object เป็น column names ต้องมี whitelist ใน service อย่าส่ง body ที่ไม่มีการคัดตรงเข้า DB

## 11. DELETE และ Exception Handling

DELETE ใช้ await ก่อนตอบเสมอ เมื่อ repo คืน affectedRows>0 จึงส่ง 204 ด้วย res.end() ไม่ส่ง JSON body หากไม่พบ ID ให้ 404

| กรณี | response status |
| --- | --- |
| Body ไม่ใช่ object/ว่าง, field ไม่อนุญาต, required field หาย | 400 |
| JSON syntax ผิด | 400 |
| ไม่พบแบรนด์หรือสินค้า | 404 |
| SKU ซ้ำ | 409 |
| brand_id ไม่พบใน brands | 400 |
| error ที่ไม่ได้คาดหมาย | 500 |

ลำดับ AppError คือ new AppError(message,statusCode) ตาม mockup เดิม อย่าสลับกับคู่มือเก่าที่เคยใช้ (status,message)

ลำดับ apiResponse คือ (res,data,pagination,status) ดังนั้น POST เรียก apiResponse(res,dto,null,201) โดยไม่เพิ่ม argument ตัวที่ 5

## 12. ทดสอบและขอบเขตที่ยืนยันแล้ว

ตรวจ JavaScript syntax, โครงสร้าง src และความตรงของไฟล์ package/SQL/tester กับต้นฉบับ พร้อมเรียก Express handlers จริงภายในโปรเซสโดยจำลอง MySQL จากข้อมูล seed ที่อ่านจาก SQL

- ชุด test-runner เดิม 12 กรณีผ่านทั้งหมดในสภาพแวดล้อมจำลองฐานข้อมูล
- ตรวจเพิ่มชื่อที่ยืนยัน, exact Summary keys, Detail JOIN/date, หน้าสุดท้าย/หน้าว่าง, PUT บาง field/ค่าเดิม, malformed JSON/unknown fields/FK และ pagination defaults/cap
- ไม่ใช้ผลตรวจเก่าที่มีอยู่ใน Downloads มาอ้างเป็นผลใหม่
- ยังไม่ได้เชื่อม MySQL จริงหรือรัน SQL initialization จึงไม่ใช่ผลยืนยัน integration กับฐานข้อมูลหรือคะแนนสอบจริง

สรุปผลการตรวจแยกไว้ใน mobile-exam-verification.json การจำลองตรวจ logic และการต่อข้อมูลระหว่างชั้น แต่ไม่ได้แทนพฤติกรรม DB ทุกกรณี เช่น timezone, DECIMAL rounding, SQL mode, connection credentials หรือ concurrent changes

validation ในตัวอย่างตั้งใจให้พื้นฐาน ไม่ใช่ schema validator ครบทุกเงื่อนไข เช่น max length/price precision/วันที่ทุกกรณียังมีข้อกำหนดของฐานข้อมูลช่วยบังคับ COUNT/SELECT และ existence/UPDATE เป็น query แยกกัน ไม่ได้เพิ่ม transaction

## 13. Checklist ก่อนนำไปเป็นตัวอย่างสอบ

1. เปิดไฟล์ให้ตรงหน้าที่: route รับ HTTP, service ตัดสิน, repo ทำ SQL, mapper เลือก field
2. ท่อง signature เดิมของ AppError และ apiResponse ให้แม่น อย่าใช้สลับกับโปรเจกต์ก่อนหน้า
3. เปลี่ยน config ให้ตรง DB แล้วตรวจ GET จริงก่อนทำ POST/PUT/DELETE
4. ตรวจ schema: key เป็น id AUTO_INCREMENT, sku UNIQUE, brand_id FK
5. ทดสอบทั้งการสร้าง ซ้ำ แก้ อ่านกลับ ลบ และอ่านหลังลบ
6. ตรวจ date/number/field names ใน response ให้ตรงตัวอย่าง
7. คง template/package/tester ตามโจทย์ ใช้คำสั่งรันที่ตรงไฟล์จริง
8. เตรียม dependencies/เครื่องมือไว้ล่วงหน้า และใช้เอกสารตามข้อกำหนดของห้องสอบ

## 14. โค้ดเต็มพร้อม comment ในไฟล์เดิม


### 14.1 src/app.js

```js
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
```

### 14.2 src/configs-$id/db-config.js

```js
// 68130500075 - MySQL pool ตามไฟล์เดิม
import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    // เปลี่ยนเฉพาะค่าตั้งต้นนี้ให้ตรง MySQL ของเครื่องฝึก; ไม่ใช่รหัสในโจทย์
    password: '1234',
    database: 'mobile_distributor',
    // DECIMAL price เป็น number ใน JSON ไม่ใช่ string เช่น "48900.00"
    decimalNumbers: true,
    // DATE คงเป็น YYYY-MM-DD ไม่แปลงเป็น Date ที่มีเวลา/timezone
    dateStrings: ['DATE']
});
export default db;
```

### 14.3 src/repositories-$id/brand.repo.js

```js
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
```

### 14.4 src/services-$id/brand.service.js

```js
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
```

### 14.5 src/routes-$id/brand.route.js

```js
import { apiResponse } from '../mappers-$id/api-response.js';
import * as service from '../services-$id/brand.service.js';
import express from 'express';

const router = express.Router();
router.get('/', async (req, res) => {
    const objects = await service.getAllObjects();
    return apiResponse(res, objects);
});
router.get('/:id', async (req, res) => {
    const object = await service.getObject(req.params.id);
    return apiResponse(res, object);
});
// ใบงานขอเฉพาะ GET Brands จึงคง handlers 405 ที่ template มีไว้
router.post('/', (req, res) => res.status(405).json({ success: false, message: 'Method not allowed' }));
router.put('/:id', (req, res) => res.status(405).json({ success: false, message: 'Method not allowed' }));
router.delete('/:id', (req, res) => res.status(405).json({ success: false, message: 'Method not allowed' }));
export default router;
```

### 14.6 src/middlewares-$id/pagination-middleware.js

```js
// คงรูปแบบ middleware factory queryParser() ตาม template
export const queryParser = () => {
    return (req, res, next) => {
        // ค่าเริ่มต้นตาม template คือ page=1, limit=20
        const { page = '1', limit = '20' } = req.query || {};
        const parsedPage = Number(page);
        const parsedLimit = Number(limit);
        // ตัวอย่างนี้คงนโยบาย fallback เดิม: ค่าผิดใช้ default แทน throw
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

### 14.7 src/repositories-$id/product.repo.js

```js
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
```

### 14.8 src/services-$id/service.js

```js
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
```

### 14.9 src/mappers-$id/product-mapper.js

```js
// ใช้ชื่อ class/ไฟล์เดิม; mapper สร้าง object ใหม่ ไม่แก้ entity
export default class EntityDtoMapper {
    static toSummaryDTO(entity) {
        // Summary มีเฉพาะ 7 field ที่ใบงานกำหนด
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
            brandName: entity.brand_name,
            category: entity.category,
            price: Number(entity.price),
            ramGb: entity.ram_gb,
            storageGb: entity.storage_gb,
            color: entity.color,
            stockQuantity: entity.stock_quantity,
            status: entity.status,
            // db-config ให้ DATE เป็น string อยู่แล้ว จึงไม่เลื่อนวันตาม timezone
            releaseDate: entity.release_date
        };
    }

    static map(entity, viewType) {
        if (viewType === 'summary') return this.toSummaryDTO(entity);
        return this.toDetailDTO(entity);
    }

    static maps(entities, viewType) {
        // คงชื่อ maps ตาม template; route ใช้ map array ตรง ๆ ได้เช่นกัน
        // ไม่แนบ total เป็น property แฝงของ array เพราะ JSON ไม่ส่ง property นั้น
        if (viewType === 'full') return entities.map(item => this.toDetailDTO(item));
        return entities.map(item => this.toSummaryDTO(item));
    }
}
```

### 14.10 src/mappers-$id/api-response.js

```js
import httpStatus from 'http-status';

// คงลำดับ argument เดิม 4 ตัว ไม่เพิ่ม total เป็น argument ใหม่
export function apiResponse(res, data, pagination = null, status = httpStatus.OK) {
    const response = {
        success: true,
        data: data,
        timestamp: new Date().toISOString()
    };
    if (pagination) {
        // route ส่ง total รวมเข้ามาใน object pagination แล้ว
        const { limit, page, total } = pagination;
        response.pagination = {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1
        };
    }
    // status() ตั้งสถานะ ส่วน json() ส่ง response จริง
    return res.status(Number(status)).json(response);
}
```

### 14.11 src/routes-$id/route.js

```js
import express from 'express';
import { apiResponse } from '../mappers-$id/api-response.js';
import ProductMapper from '../mappers-$id/product-mapper.js';
import * as service from '../services-$id/service.js';
import { queryParser } from '../middlewares-$id/pagination-middleware.js';

const router = express.Router();

router.get('/', queryParser(), async (req, res) => {
    // middleware เตรียม page/limit/offset ก่อนเข้า handler นี้
    const result = await service.getAllObjects(req.pagination);
    // แต่ละ entity ถูกเลือกเฉพาะ Summary fields
    const data = result.rows.map(ProductMapper.toSummaryDTO);
    // รวม total กับ pagination ตาม contract ของ helper เดิม
    return apiResponse(res, data, { ...req.pagination, total: result.total });
});

router.get('/:id', async (req, res) => {
    const product = await service.getObject(req.params.id);
    return apiResponse(res, ProductMapper.toDetailDTO(product));
});

router.post('/', async (req, res) => {
    const product = await service.createObject(req.body);
    // 201 เป็น argument ตัวที่ 4 ตาม helper ของ template นี้
    return apiResponse(res, ProductMapper.toDetailDTO(product), null, 201);
});

router.put('/:id', async (req, res) => {
    // ต้องส่งทั้ง path ID และ body ห้ามเรียก updateObject() ว่าง ๆ
    const product = await service.updateObject(req.params.id, req.body);
    return apiResponse(res, ProductMapper.toDetailDTO(product));
});

router.delete('/:id', async (req, res) => {
    await service.removeObject(req.params.id);
    // 204 ต้องไม่มี JSON body
    return res.status(204).end();
});

export default router;
```

### 14.12 src/middlewares-$id/error-handler.js

```js
import httpStatus from 'http-status';

// คง AppError ในไฟล์เดิม และคง argument (message, statusCode) เดิม
export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = httpStatus[statusCode];
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (err, req, res, next) => {
    if (res.headersSent) return next(err);
    // JSON parser ใช้ err.status; AppError ของเราใช้ err.statusCode
    let statusCode = err.statusCode || err.status || 500;
    let errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
    let message = err.message || 'An unexpected error occurred';

    if (err.type === 'entity.parse.failed') {
        statusCode = 400;
        errorCode = 'INVALID_JSON';
        message = 'Request body is not valid JSON';
    } else if (err.code === 'ER_DUP_ENTRY') {
        statusCode = 409;
        errorCode = 'DUPLICATE_KEY';
        message = 'SKU already exists';
    } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        statusCode = 400;
        errorCode = 'FOREIGN_KEY_NOT_FOUND';
        message = 'Brand does not exist';
    } else if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        statusCode = 409;
        errorCode = 'RESOURCE_IN_USE';
        message = 'Resource is referenced by other records';
    }
    if (statusCode === 500) {
        console.error(err);
        message = 'An unexpected error occurred';
    }
    return res.status(statusCode).json({
        success: false,
        error: { code: errorCode, message: message },
        timestamp: new Date().toISOString()
    });
};
```

### 14.13 src/test-service.js

```js
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
```
