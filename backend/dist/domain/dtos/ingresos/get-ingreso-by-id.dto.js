"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetIngresoByIdDto = void 0;
class GetIngresoByIdDto {
    constructor(id) {
        this.id = id;
    }
    static create(id) {
        const numericId = Number(id);
        if (isNaN(numericId) || numericId <= 0) {
            return [{ id: 'El ID debe ser un número válido' }, undefined];
        }
        return [undefined, new GetIngresoByIdDto(numericId)];
    }
}
exports.GetIngresoByIdDto = GetIngresoByIdDto;
