"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductosRoutes = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
class ProductosRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const controller = new controller_1.ProductosController();
        // Middlewares globales
        router.use(auth_middleware_1.AuthMiddleware.validateJWT);
        // CAJERO e INVENTARIO pueden ver los productos
        router.get('/', role_middleware_1.RoleMiddleware.requireRoles(['CAJERO', 'INVENTARIO']), controller.getProductos);
        router.get('/alertas', role_middleware_1.RoleMiddleware.requireRoles(['CAJERO', 'INVENTARIO']), controller.getAlertasStock);
        // El resto solo ADMIN
        router.use(role_middleware_1.RoleMiddleware.requireAdmin);
        router.get('/:id', controller.getProductoByID);
        router.post('/', controller.createProducto);
        router.put('/:id', controller.updateProducto);
        router.delete('/:id', controller.deleteProducto);
        return router;
    }
}
exports.ProductosRoutes = ProductosRoutes;
