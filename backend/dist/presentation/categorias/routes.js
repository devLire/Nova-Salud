"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriasRoutes = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
class CategoriasRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const controller = new controller_1.CategoriasController();
        // Middlewares globales
        router.use(auth_middleware_1.AuthMiddleware.validateJWT);
        router.use(role_middleware_1.RoleMiddleware.requireAdmin);
        router.get('/', controller.getCategorias);
        router.get('/:id', controller.getCategoriaByID);
        router.post('/', controller.createCategoria);
        router.put('/:id', controller.updateCategoria);
        router.delete('/:id', controller.deleteCategoria);
        return router;
    }
}
exports.CategoriasRoutes = CategoriasRoutes;
