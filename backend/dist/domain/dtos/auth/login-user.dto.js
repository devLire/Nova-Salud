"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserDto = void 0;
const regular_exp_1 = require("../../../config/regular-exp");
class LoginUserDto {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
    static create(props) {
        const { email, password } = props;
        const errors = {};
        if (!email || !regular_exp_1.regularExps.email.test(email))
            errors.email = 'El email no es válido';
        if (!password) {
            errors.password = 'El campo "password" es obligatorio.';
        }
        else if (password.length < 6) {
            errors.password = 'Debe tener al menos 6 caracteres.';
        }
        if (Object.keys(errors).length > 0)
            return [errors, undefined];
        return [undefined, new LoginUserDto(email.toLowerCase().trim(), password)];
    }
}
exports.LoginUserDto = LoginUserDto;
