"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVentaDto = void 0;
class UpdateVentaDto {
    constructor(id, id_usuario, metodo_pago) {
        this.id = id;
        this.id_usuario = id_usuario;
        this.metodo_pago = metodo_pago;
    }
    get values() {
        const returnObj = {};
        if (this.id_usuario !== undefined)
            returnObj.id_usuario = this.id_usuario;
        if (this.metodo_pago !== undefined)
            returnObj.metodo_pago = this.metodo_pago;
        return returnObj;
    }
    static create(object) {
        const { id, id_usuario, metodo_pago } = object;
        const errors = {};
        const numericId = Number(id);
        if (isNaN(numericId) || numericId <= 0) {
            return [{ id: 'El ID debe ser un número válido' }, undefined];
        }
        if (id_usuario === undefined && metodo_pago === undefined) {
            return [{ data: 'No hay datos para actualizar' }, undefined];
        }
        const numericUsuario = id_usuario !== undefined ? Number(id_usuario) : undefined;
        if (id_usuario !== undefined &&
            (isNaN(numericUsuario) || numericUsuario <= 0)) {
            errors.id_usuario = 'El id_usuario debe ser un número válido';
        }
        if (metodo_pago !== undefined) {
            const metodoPagoString = metodo_pago.toString().toUpperCase().trim();
            if (metodoPagoString !== 'TARJETA' && metodoPagoString !== 'EFECTIVO') {
                errors.metodo_pago =
                    'El método de pago solo puede ser: TARJETA, EFECTIVO';
            }
        }
        if (Object.keys(errors).length > 0)
            return [errors, undefined];
        return [
            undefined,
            new UpdateVentaDto(numericId, numericUsuario, metodo_pago === null || metodo_pago === void 0 ? void 0 : metodo_pago.toString().toUpperCase().trim()),
        ];
    }
}
exports.UpdateVentaDto = UpdateVentaDto;
