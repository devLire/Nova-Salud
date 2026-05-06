"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateVentaDto = void 0;
class CreateVentaDto {
    constructor(productos, id_usuario, metodo_pago) {
        this.productos = productos;
        this.id_usuario = id_usuario;
        this.metodo_pago = metodo_pago;
    }
    static create(object = {}) {
        const { productos, id_usuario, metodo_pago } = object;
        const errors = {};
        const parsedIdUsuario = id_usuario !== undefined ? Number(id_usuario) : undefined;
        if (id_usuario !== undefined &&
            (isNaN(parsedIdUsuario) || parsedIdUsuario <= 0)) {
            errors.id_usuario = 'El campo "id_usuario" debe ser un número válido mayor a 0.';
        }
        if (!productos || !Array.isArray(productos) || productos.length === 0) {
            errors.productos = 'Debe incluir un arreglo de "productos" válido con al menos 1 producto.';
        }
        else {
            for (const p of productos) {
                const id = Number(p.id_producto);
                const cant = Number(p.cantidad);
                if (isNaN(id) || id <= 0 || isNaN(cant) || cant <= 0) {
                    errors.productos = 'Cada producto debe tener "id_producto" y "cantidad" como números válidos mayores a 0.';
                    break;
                }
            }
        }
        if (Object.keys(errors).length > 0)
            return [errors, undefined];
        const productosParseados = productos.map((p) => ({
            id_producto: Number(p.id_producto),
            cantidad: Number(p.cantidad)
        }));
        return [
            undefined,
            new CreateVentaDto(productosParseados, parsedIdUsuario, metodo_pago === null || metodo_pago === void 0 ? void 0 : metodo_pago.trim()),
        ];
    }
}
exports.CreateVentaDto = CreateVentaDto;
