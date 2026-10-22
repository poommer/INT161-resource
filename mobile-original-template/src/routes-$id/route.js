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
