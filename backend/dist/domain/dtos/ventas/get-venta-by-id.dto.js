"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVentaByIdDto = void 0;
class GetVentaByIdDto {
    constructor(id) {
        this.id = id;
    }
    static create(id) {
        if (isNaN(id))
            return [{ id: 'El ID debe ser un número válido' }];
        if (id <= 0)
            return [{ id: 'El ID debe ser un número mayor a 0' }];
        return [undefined, new GetVentaByIdDto(id)];
    }
}
exports.GetVentaByIdDto = GetVentaByIdDto;
