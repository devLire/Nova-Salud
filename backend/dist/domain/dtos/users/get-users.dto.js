"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsersDto = void 0;
class GetUsersDto {
    constructor(page, limit) {
        this.page = page;
        this.limit = limit;
    }
    static create(page = 1, limit = 10) {
        if (isNaN(page) || isNaN(limit))
            return [{ pagination: 'Página y límite deben ser números' }];
        if (page <= 0)
            return [{ pagination: 'La página debe ser mayor a 0' }];
        if (limit <= 0)
            return [{ pagination: 'El límite debe ser mayor a 0' }];
        return [undefined, new GetUsersDto(page, limit)];
    }
}
exports.GetUsersDto = GetUsersDto;
