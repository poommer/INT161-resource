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
