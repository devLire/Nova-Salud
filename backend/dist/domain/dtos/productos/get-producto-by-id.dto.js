"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProductoByIdDto = void 0;
class GetProductoByIdDto {
    constructor(id) {
        this.id = id;
    }
    static create(id) {
        const numericId = Number(id);
        if (isNaN(numericId))
            return [{ id: 'El ID debe ser un número válido' }, undefined];
        if (numericId <= 0)
            return [{ id: 'El ID debe ser mayor a 0' }, undefined];
        return [undefined, new GetProductoByIdDto(numericId)];
    }
}
exports.GetProductoByIdDto = GetProductoByIdDto;
