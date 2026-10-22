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
