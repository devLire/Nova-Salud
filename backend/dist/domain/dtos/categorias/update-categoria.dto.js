"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCategoriaDto = void 0;
class UpdateCategoriaDto {
    constructor(id, nombre, descripcion, activo) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.activo = activo;
    }
    get values() {
        const returnObj = {};
        if (this.nombre !== undefined)
            returnObj.nombre = this.nombre;
        if (this.descripcion !== undefined)
            returnObj.descripcion = this.descripcion;
        if (this.activo !== undefined)
            returnObj.activo = this.activo;
        return returnObj;
    }
    static create(object) {
        const { id, nombre, descripcion, activo } = object;
        const numericId = Number(id);
        if (isNaN(numericId) || numericId <= 0) {
            return [{ id: 'El ID debe ser un número válido' }, undefined];
        }
        if (!nombre && descripcion === undefined && activo === undefined) {
            return [{ data: 'No hay datos para actualizar' }, undefined];
        }
        return [
            undefined,
            new UpdateCategoriaDto(numericId, nombre === null || nombre === void 0 ? void 0 : nombre.trim(), descripcion === null || descripcion === void 0 ? void 0 : descripcion.trim(), activo !== undefined ? Boolean(activo) : undefined),
        ];
    }
}
exports.UpdateCategoriaDto = UpdateCategoriaDto;
