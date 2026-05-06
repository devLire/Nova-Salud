"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCategoriaDto = void 0;
class CreateCategoriaDto {
    constructor(nombre, descripcion) {
        this.nombre = nombre;
        this.descripcion = descripcion;
    }
    static create(object) {
        const { nombre, descripcion } = object;
        const errors = {};
        if (!nombre || nombre.trim() === '') {
            errors.nombre = 'El campo "nombre" es obligatorio.';
        }
        if (Object.keys(errors).length > 0)
            return [errors, undefined];
        return [
            undefined,
            new CreateCategoriaDto(nombre.trim(), descripcion === null || descripcion === void 0 ? void 0 : descripcion.trim()),
        ];
    }
}
exports.CreateCategoriaDto = CreateCategoriaDto;
