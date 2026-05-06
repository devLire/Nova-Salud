"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserDto = void 0;
const regular_exp_1 = require("../../../config/regular-exp");
class CreateUserDto {
    constructor(nombre, email, rol, password) {
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
        this.password = password;
    }
    static create(props) {
        const { nombre, email, rol, password } = props;
        const errors = {};
        if (!nombre || nombre.trim().length === 0) {
            errors.nombre = 'El campo "nombre" es obligatorio.';
        }
        if (!email) {
            errors.email = 'El campo "email" es obligatorio.';
        }
        else {
            if (!regular_exp_1.regularExps.email.test(email))
                errors.email = 'El email no es válido.';
        }
        const allowedRoles = ['ADMINISTRADOR', 'CAJERO', 'INVENTARIO'];
        if (!rol) {
            errors.rol = 'El campo "rol" es obligatorio.';
        }
        else if (!allowedRoles.includes(rol.toUpperCase().trim())) {
            errors.rol = `Roles permitidos: ${allowedRoles.join(', ')}.`;
        }
        if (!password) {
            errors.password = 'El campo "password" es obligatorio.';
        }
        else if (password.length < 6) {
            errors.password = 'Debe tener al menos 6 caracteres.';
        }
        if (Object.keys(errors).length > 0)
            return [errors, undefined];
        return [
            undefined,
            new CreateUserDto(nombre.trim(), email.toLowerCase().trim(), rol.toUpperCase().trim(), password),
        ];
    }
}
exports.CreateUserDto = CreateUserDto;
