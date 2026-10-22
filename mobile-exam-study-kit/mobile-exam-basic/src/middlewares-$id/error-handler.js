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
