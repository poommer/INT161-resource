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
