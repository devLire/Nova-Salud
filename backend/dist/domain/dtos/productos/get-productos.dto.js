"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProductosDto = void 0;
class GetProductosDto {
    constructor(page, limit) {
        this.page = page;
        this.limit = limit;
    }
    static create(page = 1, limit = 10) {
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        if (isNaN(pageNumber) || isNaN(limitNumber))
            return [{ pagination: 'Página y límite deben ser números' }, undefined];
        if (pageNumber <= 0)
            return [{ pagination: 'La página debe ser mayor a 0' }, undefined];
        if (limitNumber <= 0)
            return [{ pagination: 'El límite debe ser mayor a 0' }, undefined];
        return [undefined, new GetProductosDto(pageNumber, limitNumber)];
    }
}
exports.GetProductosDto = GetProductosDto;
