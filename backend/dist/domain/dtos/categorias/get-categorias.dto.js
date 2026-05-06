"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCategoriasDto = void 0;
class GetCategoriasDto {
    constructor(page, limit) {
        this.page = page;
        this.limit = limit;
    }
    static create(page = 1, limit = 10) {
        if (isNaN(page) || isNaN(limit))
            return [{ pagination: 'Página y límite deben ser números' }, undefined];
        if (page <= 0)
            return [{ pagination: 'La página debe ser mayor a 0' }, undefined];
        if (limit <= 0)
            return [{ pagination: 'El límite debe ser mayor a 0' }, undefined];
        return [undefined, new GetCategoriasDto(page, limit)];
    }
}
exports.GetCategoriasDto = GetCategoriasDto;
