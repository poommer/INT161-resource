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
