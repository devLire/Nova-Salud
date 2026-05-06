"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDto = void 0;
const regular_exp_1 = require("../../../config/regular-exp");
class UpdateUserDto {
    constructor(id, nombre, email, rol, password, activo) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
        this.password = password;
        this.activo = activo;
    }
    get values() {
        const returnObj = {};
        if (this.nombre !== undefined)
            returnObj.nombre = this.nombre;
        if (this.email !== undefined)
            returnObj.email = this.email;
        if (this.rol !== undefined)
            returnObj.rol = this.rol;
        if (this.password !== undefined)
            returnObj.password = this.password;
        if (this.activo !== undefined)
            returnObj.activo = this.activo;
        return returnObj;
    }
    static create(props) {
        const { id, nombre, email, rol, password, activo } = props;
        const errors = {};
        if (!id || Number(isNaN(id)))
            return [{ id: 'El ID debe ser un número válido' }, undefined];
        if (!nombre && !email && !rol && !password && activo === undefined) {
            return [{ data: 'No hay datos para actualizar' }, undefined];
        }
        if (email !== undefined) {
            if (!regular_exp_1.regularExps.email.test(email)) {
                errors.email = 'El email no es válido.';
            }
        }
        if (rol !== undefined) {
            const allowedRoles = ['ADMINISTRADOR', 'CAJERO', 'INVENTARIO'];
            if (!allowedRoles.includes(rol.toUpperCase().trim())) {
                errors.rol = `Roles permitidos: ${allowedRoles.join(', ')}.`;
            }
        }
        if (password !== undefined) {
            if (password.length < 6) {
                errors.password = 'La contraseña debe tener al menos 6 caracteres.';
            }
        }
        if (Object.keys(errors).length > 0)
            return [errors, undefined];
        return [
            undefined,
            new UpdateUserDto(id, nombre === null || nombre === void 0 ? void 0 : nombre.trim(), email === null || email === void 0 ? void 0 : email.toLowerCase().trim(), rol === null || rol === void 0 ? void 0 : rol.toUpperCase().trim(), password, activo !== undefined ? Boolean(activo) : undefined),
        ];
    }
}
exports.UpdateUserDto = UpdateUserDto;
