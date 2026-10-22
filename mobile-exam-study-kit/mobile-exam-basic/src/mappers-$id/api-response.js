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
