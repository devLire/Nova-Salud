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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jwt_adapter_1 = require("../config/jwt.adapter");
const posgres_1 = require("../data/posgres");
class AuthMiddleware {
    static validateJWT(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorization = req.header('Authorization');
            if (!authorization)
                return res.status(401).json({
                    status: 'fail',
                    message: 'No se proporcionó un token',
                    errors: null,
                });
            if (!authorization.startsWith('Bearer '))
                return res.status(401).json({
                    status: 'fail',
                    message: 'Token Bearer inválido',
                    errors: null,
                });
            // Extraemos el token quitando la palabra "Bearer "
            const token = authorization.split(' ')[1] || '';
            try {
                // Validamos el token y extraemos el payload (que será el id_usuario)
                const payload = yield jwt_adapter_1.JwtAdapter.validateToken(token);
                if (!payload)
                    return res.status(401).json({
                        status: 'fail',
                        message: 'Token no válido o expirado',
                        errors: null,
                    });
                // Verificamos que el usuario del token siga existiendo y esté activo en la BD
                const user = yield posgres_1.prisma.usuario.findUnique({
                    where: { id_usuario: payload.id },
                });
                if (!user)
                    return res
                        .status(401)
                        .json({ error: 'Token no válido - usuario no existe' });
                if (!user.activo)
                    return res.status(401).json({
                        status: 'fail',
                        message: 'El usuario está inactivo',
                        errors: null,
                    });
                // Inyectamos el usuario en el request para que el controlador lo pueda usar
                req.user = user;
                // Todo está correcto, dejamos pasar la petición
                next();
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    status: error,
                    message: 'Error interno del servidor',
                    errors: null,
                });
            }
        });
    }
}
exports.AuthMiddleware = AuthMiddleware;
