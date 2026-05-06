"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProveedorDto = void 0;
class CreateProveedorDto {
    constructor(nombre_empresa, contacto, telefono) {
        this.nombre_empresa = nombre_empresa;
        this.contacto = contacto;
        this.telefono = telefono;
    }
    static create(object) {
        const { nombre_empresa, contacto, telefono } = object;
        const normalizedTelefono = telefono.toString();
        const errors = {};
        if (!nombre_empresa || nombre_empresa.trim() === '') {
            errors.nombre_empresa = 'El nombre de la empresa es obligatorio';
        }
        if (!contacto || contacto.trim() === '') {
            errors.contacto = 'El contacto de la empresa es obligatorio';
        }
        if (!normalizedTelefono || normalizedTelefono.trim() === '') {
            errors.telefono = 'El teléfono de la empresa es obligatorio';
        }
        if (Object.keys(errors).length > 0)
            return [errors, undefined];
        return [
            undefined,
            new CreateProveedorDto(nombre_empresa.trim(), contacto === null || contacto === void 0 ? void 0 : contacto.trim(), normalizedTelefono === null || normalizedTelefono === void 0 ? void 0 : normalizedTelefono.trim()),
        ];
    }
}
exports.CreateProveedorDto = CreateProveedorDto;
