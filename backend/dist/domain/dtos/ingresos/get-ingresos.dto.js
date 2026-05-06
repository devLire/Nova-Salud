"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetIngresosDto = void 0;
class GetIngresosDto {
    constructor(page, limit) {
        this.page = page;
        this.limit = limit;
    }
    static create(page = 1, limit = 10) {
        const errors = {};
        if (isNaN(page) || page <= 0) {
            errors.page = 'La página debe ser un número mayor a 0';
        }
        if (isNaN(limit) || limit <= 0) {
            errors.limit = 'El límite debe ser un número mayor a 0';
        }
        if (Object.keys(errors).length > 0)
            return [errors, undefined];
        return [undefined, new GetIngresosDto(page, limit)];
    }
}
exports.GetIngresosDto = GetIngresosDto;
