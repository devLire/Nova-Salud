"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProveedorByIdDto = void 0;
class GetProveedorByIdDto {
    constructor(id) {
        this.id = id;
    }
    static create(id) {
        const numericId = Number(id);
        if (isNaN(numericId))
            return [{ id: 'El ID debe ser un número válido' }, undefined];
        if (numericId <= 0)
            return [{ id: 'El ID debe ser mayor a 0' }, undefined];
        return [undefined, new GetProveedorByIdDto(numericId)];
    }
}
exports.GetProveedorByIdDto = GetProveedorByIdDto;
