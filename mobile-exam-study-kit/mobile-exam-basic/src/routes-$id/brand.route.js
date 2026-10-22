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
