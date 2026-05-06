"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProveedoresRoutes = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
class ProveedoresRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const controller = new controller_1.ProveedorController();
        // Middlewares globales
        router.use(auth_middleware_1.AuthMiddleware.validateJWT);
        router.use(role_middleware_1.RoleMiddleware.requireAdmin);
        router.get('/', controller.getProveedores);
        router.get('/:id', controller.getProveedorByID);
        router.post('/', controller.createProveedor);
        router.put('/:id', controller.updateProveedor);
        router.delete('/:id', controller.deleteProveedor);
        return router;
    }
}
exports.ProveedoresRoutes = ProveedoresRoutes;
