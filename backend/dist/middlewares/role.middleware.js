"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleMiddleware = void 0;
class RoleMiddleware {
}
exports.RoleMiddleware = RoleMiddleware;
RoleMiddleware.requireAdmin = (req, res, next) => {
    const user = req.user;
    if (!user) {
        return res.status(500).json({
            status: 'error',
            message: 'Se requiere validar el token antes de verificar el rol',
        });
    }
    if (user.rol !== 'ADMINISTRADOR') {
        return res.status(403).json({
            status: 'fail',
            message: 'Acceso denegado: Se requieren privilegios de Administrador',
            errors: null,
        });
    }
    next();
};
RoleMiddleware.requireRoles = (rolesPermitidos) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user)
            return res
                .status(500)
                .json({ status: 'error', message: 'Falta validar token' });
        // ADMINISTRADOR siempre tiene acceso a todo.
        if (user.rol === 'ADMINISTRADOR') {
            return next();
        }
        if (!rolesPermitidos.includes(user.rol)) {
            return res.status(403).json({
                status: 'fail',
                message: `Acceso denegado. Roles permitidos: ${rolesPermitidos.join(', ')}`,
                errors: null,
            });
        }
        next();
    };
};
