"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateIngresoDto = void 0;
class CreateIngresoDto {
    constructor(id_producto, id_usuario, cantidad_ingresada) {
        this.id_producto = id_producto;
        this.id_usuario = id_usuario;
        this.cantidad_ingresada = cantidad_ingresada;
    }
    static create(object) {
        if (!object)
            return [{ data: 'No se han proporcionado datos' }, undefined];
        const { id_producto, id_usuario, cantidad_ingresada } = object;
        const errors = {};
        const numericProducto = Number(id_producto);
        if (isNaN(numericProducto) || numericProducto <= 0) {
            errors.id_producto = 'El id_producto debe ser un número válido';
        }
        const numericUsuario = Number(id_usuario);
        if (isNaN(numericUsuario) || numericUsuario <= 0) {
            errors.id_usuario = 'El id_usuario debe ser un número válido';
        }
        const numericCantidad = Number(cantidad_ingresada);
        if (isNaN(numericCantidad) || numericCantidad <= 0) {
            errors.cantidad_ingresada = 'La cantidad_ingresada debe ser un número válido mayor a 0';
        }
        if (Object.keys(errors).length > 0)
            return [errors, undefined];
        return [undefined, new CreateIngresoDto(numericProducto, numericUsuario, numericCantidad)];
    }
}
exports.CreateIngresoDto = CreateIngresoDto;
