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
