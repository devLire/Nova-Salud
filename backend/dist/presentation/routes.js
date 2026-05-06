"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutes = void 0;
const express_1 = require("express");
const routes_1 = require("./users/routes");
const routes_2 = require("./auth/routes");
const routes_3 = require("./proveedores/routes");
const routes_4 = require("./categorias/routes");
const routes_5 = require("./productos/routes");
const routes_6 = require("./ventas/routes");
const routes_7 = require("./ingresos/routes");
const routes_8 = require("./seed/routes");
class AppRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        router.use('/api/users', routes_1.UserRoutes.routes);
        router.use('/api/auth', routes_2.AuthRoutes.routes);
        router.use('/api/proveedores', routes_3.ProveedoresRoutes.routes);
        router.use('/api/categorias', routes_4.CategoriasRoutes.routes);
        router.use('/api/productos', routes_5.ProductosRoutes.routes);
        router.use('/api/ventas', routes_6.VentasRoutes.routes);
        router.use('/api/ingresos', routes_7.IngresosRoutes.routes);
        router.use('/api/seed', routes_8.SeedRoutes.routes);
        return router;
    }
}
exports.AppRoutes = AppRoutes;
