"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./users/create-user.dto"), exports);
__exportStar(require("./users/update-user.dto"), exports);
__exportStar(require("./users/get-users.dto"), exports);
__exportStar(require("./users/get-user-by-id.dto"), exports);
__exportStar(require("./proveedor/create-proveedor.dto"), exports);
__exportStar(require("./proveedor/update-proveedor.dto"), exports);
__exportStar(require("./proveedor/get-proveedores.dto"), exports);
__exportStar(require("./proveedor/get-proveedor-by-id.dto"), exports);
__exportStar(require("./categorias/create-categoria.dto"), exports);
__exportStar(require("./categorias/update-categoria.dto"), exports);
__exportStar(require("./categorias/get-categorias.dto"), exports);
__exportStar(require("./categorias/get-categoria-by-id.dto"), exports);
__exportStar(require("./productos/create-producto.dto"), exports);
__exportStar(require("./productos/update-producto.dto"), exports);
__exportStar(require("./productos/get-productos.dto"), exports);
__exportStar(require("./productos/get-producto-by-id.dto"), exports);
__exportStar(require("./ventas/create-venta.dto"), exports);
__exportStar(require("./ventas/update-venta.dto"), exports);
__exportStar(require("./ventas/get-ventas.dto"), exports);
__exportStar(require("./ventas/get-venta-by-id.dto"), exports);
__exportStar(require("./ingresos/create-ingreso.dto"), exports);
__exportStar(require("./ingresos/get-ingreso-by-id.dto"), exports);
__exportStar(require("./ingresos/get-ingresos.dto"), exports);
