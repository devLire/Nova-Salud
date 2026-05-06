"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductoDto = void 0;
class UpdateProductoDto {
    constructor(id, nombre, precio_venta, id_categoria, id_proveedor, codigo_barras, descripcion, stock_actual, stock_minimo, activo) {
        this.id = id;
        this.nombre = nombre;
        this.precio_venta = precio_venta;
        this.id_categoria = id_categoria;
        this.id_proveedor = id_proveedor;
        this.codigo_barras = codigo_barras;
        this.descripcion = descripcion;
        this.stock_actual = stock_actual;
        this.stock_minimo = stock_minimo;
        this.activo = activo;
    }
    get values() {
        const returnObj = {};
        if (this.nombre)
            returnObj.nombre = this.nombre;
        if (this.precio_venta !== undefined)
            returnObj.precio_venta = this.precio_venta;
        if (this.id_categoria !== undefined)
            returnObj.id_categoria = this.id_categoria;
        if (this.id_proveedor !== undefined)
            returnObj.id_proveedor = this.id_proveedor;
        if (this.codigo_barras !== undefined)
            returnObj.codigo_barras = this.codigo_barras;
        if (this.descripcion !== undefined)
            returnObj.descripcion = this.descripcion;
        if (this.stock_actual !== undefined)
            returnObj.stock_actual = this.stock_actual;
        if (this.stock_minimo !== undefined)
            returnObj.stock_minimo = this.stock_minimo;
        if (this.activo !== undefined)
            returnObj.activo = this.activo;
        return returnObj;
    }
    static create(object) {
        const { id, nombre, precio_venta, id_categoria, id_proveedor, codigo_barras, descripcion, stock_actual, stock_minimo, activo, } = object;
        const errors = {};
        const numericId = Number(id);
        if (isNaN(numericId) || numericId <= 0) {
            return [{ id: 'El ID debe ser un número válido' }, undefined];
        }
        const numericCategoria = id_categoria !== undefined ? Number(id_categoria) : undefined;
        if (id_categoria !== undefined &&
            (isNaN(numericCategoria) || numericCategoria <= 0)) {
            errors.id_categoria = 'El id_categoria debe ser un número válido';
        }
        const numericPrecioVenta = precio_venta !== undefined ? Number(precio_venta) : undefined;
        if (precio_venta !== undefined && isNaN(numericPrecioVenta)) {
            errors.precio_venta = 'El precio de venta debe ser un número válido';
        }
        const numericStockActual = stock_actual !== undefined ? Number(stock_actual) : undefined;
        if (stock_actual !== undefined && isNaN(numericStockActual)) {
            errors.stock_actual = 'El stock actual debe ser un número válido';
        }
        const numericStockMinimo = stock_minimo !== undefined ? Number(stock_minimo) : undefined;
        if (stock_minimo !== undefined && isNaN(numericStockMinimo)) {
            errors.stock_minimo = 'El stock mínimo debe ser un número válido';
        }
        if (!nombre &&
            precio_venta === undefined &&
            id_categoria === undefined &&
            id_proveedor === undefined &&
            codigo_barras === undefined &&
            descripcion === undefined &&
            stock_actual === undefined &&
            stock_minimo === undefined &&
            activo === undefined) {
            return [{ data: 'No hay datos para actualizar' }, undefined];
        }
        const numericProveedor = id_proveedor !== undefined ? Number(id_proveedor) : undefined;
        if (id_proveedor !== undefined &&
            (isNaN(numericProveedor) || numericProveedor <= 0)) {
            errors.id_proveedor = 'El id_proveedor debe ser un número válido';
        }
        if (Object.keys(errors).length > 0)
            return [errors, undefined];
        return [
            undefined,
            new UpdateProductoDto(numericId, nombre === null || nombre === void 0 ? void 0 : nombre.trim(), numericPrecioVenta, numericCategoria, numericProveedor, codigo_barras === null || codigo_barras === void 0 ? void 0 : codigo_barras.trim(), descripcion === null || descripcion === void 0 ? void 0 : descripcion.trim(), numericStockActual, numericStockMinimo, activo !== undefined ? Boolean(activo) : undefined),
        ];
    }
}
exports.UpdateProductoDto = UpdateProductoDto;
