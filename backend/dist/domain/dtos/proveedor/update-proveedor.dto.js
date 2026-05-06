"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProveedorDto = void 0;
class UpdateProveedorDto {
    constructor(id, nombre_empresa, contacto, telefono, activo) {
        this.id = id;
        this.nombre_empresa = nombre_empresa;
        this.contacto = contacto;
        this.telefono = telefono;
        this.activo = activo;
    }
    get values() {
        const returnObj = {};
        if (this.nombre_empresa !== undefined)
            returnObj.nombre_empresa = this.nombre_empresa;
        if (this.contacto !== undefined)
            returnObj.contacto = this.contacto;
        if (this.telefono !== undefined)
            returnObj.telefono = this.telefono;
        if (this.activo !== undefined)
            returnObj.activo = this.activo;
        return returnObj;
    }
    static create(object) {
        const { id, nombre_empresa, contacto, telefono, activo } = object;
        const normalizedTelefono = telefono === null || telefono === void 0 ? void 0 : telefono.toString();
        const numericId = Number(id);
        if (isNaN(numericId) || numericId <= 0) {
            return [{ id: 'El ID debe ser un número válido' }, undefined];
        }
        if (!nombre_empresa &&
            contacto === undefined &&
            normalizedTelefono === undefined &&
            activo === undefined) {
            return [{ data: 'No hay datos para actualizar' }, undefined];
        }
        return [
            undefined,
            new UpdateProveedorDto(numericId, nombre_empresa === null || nombre_empresa === void 0 ? void 0 : nombre_empresa.trim(), contacto === null || contacto === void 0 ? void 0 : contacto.trim(), normalizedTelefono === null || normalizedTelefono === void 0 ? void 0 : normalizedTelefono.trim(), activo !== undefined ? Boolean(activo) : undefined),
        ];
    }
}
exports.UpdateProveedorDto = UpdateProveedorDto;
