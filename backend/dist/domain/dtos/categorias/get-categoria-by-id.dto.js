"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCategoriaByIdDto = void 0;
class GetCategoriaByIdDto {
    constructor(id) {
        this.id = id;
    }
    static create(id) {
        const numericId = Number(id);
        if (isNaN(numericId))
            return [{ id: 'El ID debe ser un número válido' }, undefined];
        if (numericId <= 0)
            return [{ id: 'El ID debe ser mayor a 0' }, undefined];
        return [undefined, new GetCategoriaByIdDto(numericId)];
    }
}
exports.GetCategoriaByIdDto = GetCategoriaByIdDto;
