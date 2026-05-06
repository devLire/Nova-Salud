"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngresosRoutes = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
class IngresosRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const ingresosController = new controller_1.IngresosController();
        // Middlewares globales
        router.use(auth_middleware_1.AuthMiddleware.validateJWT);
        // INVENTARIO puede registrar un ingreso
        router.post('/', role_middleware_1.RoleMiddleware.requireRoles(['INVENTARIO']), ingresosController.createIngreso);
        // CAJERO e INVENTARIO pueden ver los ingresos
        router.get('/', role_middleware_1.RoleMiddleware.requireRoles(['CAJERO', 'INVENTARIO']), ingresosController.getIngresos);
        // El resto solo ADMIN
        router.use(role_middleware_1.RoleMiddleware.requireAdmin);
        router.get('/:id', ingresosController.getIngresoByID);
        return router;
    }
}
exports.IngresosRoutes = IngresosRoutes;
