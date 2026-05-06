"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const posgres_1 = require("../../data/posgres");
const jwt_adapter_1 = require("../../config/jwt.adapter");
const login_user_dto_1 = require("../../domain/dtos/auth/login-user.dto");
class AuthController {
    constructor() {
        this.loginUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [errors, loginDto] = login_user_dto_1.LoginUserDto.create(req.body);
            if (errors)
                return res.status(400).json({
                    status: 'fail',
                    message: 'Los datos proporcionados no son válidos.',
                    errors,
                });
            try {
                // Verificar si el correo existe
                const user = yield posgres_1.prisma.usuario.findUnique({
                    where: { email: loginDto.email },
                });
                if (!user || !user.activo) {
                    return res.status(400).json({
                        status: 'fail',
                        message: 'Credenciales incorrectas',
                        errors: null,
                    });
                }
                // Verificar contraseña
                if (loginDto.password !== user.password) {
                    return res
                        .status(400)
                        .json({ status: 'fail', message: 'Credenciales incorrectas' });
                }
                // Generar el JWT usando el ID del usuario
                const token = yield jwt_adapter_1.JwtAdapter.generateToken({ id: user.id_usuario });
                if (!token)
                    return res.status(500).json({
                        status: 'fail',
                        message: 'Error al generar el token',
                        errors: null,
                    });
                // Devolvemos el usuario y el token
                const { password, activo } = user, userEntity = __rest(user, ["password", "activo"]);
                return res.json({
                    status: 'success',
                    user: userEntity,
                    token: token,
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error interno del servidor',
                    errors: null,
                });
            }
        });
        this.checkAuthStatusUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const { password } = user, userEntity = __rest(user, ["password"]);
            // Generamos un nuevo token para refrescar la sesión del usuario
            const token = yield jwt_adapter_1.JwtAdapter.generateToken({ id: user.id_usuario });
            return res.json({
                status: 'success',
                user: userEntity,
                token: token,
            });
        });
    }
}
exports.AuthController = AuthController;
