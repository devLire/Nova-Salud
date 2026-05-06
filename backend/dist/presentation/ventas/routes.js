"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentasRoutes = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
class VentasRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const ventasController = new controller_1.VentasController();
        // Middlewares globales
        router.use(auth_middleware_1.AuthMiddleware.validateJWT);
        // CAJERO puede registrar una venta
        router.post('/', role_middleware_1.RoleMiddleware.requireRoles(['CAJERO']), ventasController.createVenta);
        // CAJERO e INVENTARIO pueden ver las ventas
        router.get('/', role_middleware_1.RoleMiddleware.requireRoles(['CAJERO', 'INVENTARIO']), ventasController.getVentas);
        // El resto solo ADMIN
        router.use(role_middleware_1.RoleMiddleware.requireAdmin);
        router.get('/:id', ventasController.getVentaByID);
        router.put('/:id', ventasController.updateVenta);
        return router;
    }
}
exports.VentasRoutes = VentasRoutes;
