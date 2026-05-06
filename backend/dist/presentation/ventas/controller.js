"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentasController = void 0;
const posgres_1 = require("../../data/posgres");
const dtos_1 = require("../../domain/dtos");
class VentasController {
    constructor() {
        this.getVentas = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10, search = '' } = req.query;
            const [errors, getVentasDto] = dtos_1.GetVentasDto.create(+page, +limit);
            if (errors)
                return res.status(400).json({
                    status: 'fail',
                    message: 'Los datos proporcionados no son vlidos.',
                    errors,
                });
            try {
                const whereClause = {};
                if (search) {
                    whereClause.OR = [
                        {
                            usuario: {
                                nombre: { contains: String(search), mode: 'insensitive' },
                            },
                        },
                        { metodo_pago: { contains: String(search), mode: 'insensitive' } },
                    ];
                    // Also check if search is a number to search by id_venta
                    if (!isNaN(Number(search))) {
                        whereClause.OR.push({ id_venta: Number(search) });
                    }
                }
                const [ventas, total] = yield Promise.all([
                    posgres_1.prisma.venta.findMany({
                        where: whereClause,
                        skip: (getVentasDto.page - 1) * getVentasDto.limit,
                        take: getVentasDto.limit,
                        orderBy: { fecha_hora: 'desc' },
                        select: {
                            id_venta: true,
                            id_usuario: true,
                            fecha_hora: true,
                            total: true,
                            metodo_pago: true,
                            usuario: {
                                select: { id_usuario: true, nombre: true },
                            },
                            detalles: true,
                        },
                    }),
                    posgres_1.prisma.venta.count({ where: whereClause }),
                ]);
                const hasNext = getVentasDto.page * getVentasDto.limit < total;
                const searchParam = search
                    ? `&search=${encodeURIComponent(String(search))}`
                    : '';
                return res.json({
                    status: 'success',
                    message: 'Ventas obtenidas correctamente',
                    data: ventas,
                    pagination: {
                        page: getVentasDto.page,
                        limit: getVentasDto.limit,
                        total,
                        next: hasNext
                            ? `/api/ventas?page=${getVentasDto.page + 1}&limit=${getVentasDto.limit}${searchParam}`
                            : null,
                        prev: getVentasDto.page > 1
                            ? `/api/ventas?page=${getVentasDto.page - 1}&limit=${getVentasDto.limit}${searchParam}`
                            : null,
                    },
                });
            }
            catch (e) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al obtener ventas',
                    errors: null,
                    e: e,
                });
            }
        });
        this.getVentaByID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            const [errors, getVentaByIdDto] = dtos_1.GetVentaByIdDto.create(id);
            if (errors)
                return res.status(400).json({
                    status: 'fail',
                    message: 'Los datos proporcionados no son válidos.',
                    errors,
                });
            try {
                const venta = yield posgres_1.prisma.venta.findUnique({
                    where: { id_venta: getVentaByIdDto.id },
                    select: {
                        id_venta: true,
                        id_usuario: true,
                        fecha_hora: true,
                        total: true,
                        metodo_pago: true,
                        usuario: {
                            select: { id_usuario: true, nombre: true },
                        },
                        detalles: true,
                    },
                });
                if (!venta) {
                    return res.status(404).json({
                        status: 'fail',
                        message: `Venta with ID ${id} not found`,
                        errors: null,
                    });
                }
                return res.json({
                    status: 'success',
                    message: 'Venta obtenida correctamente',
                    data: venta,
                });
            }
            catch (e) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al obtener venta',
                    errors: null,
                });
            }
        });
        this.createVenta = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [errors, createVentaDto] = dtos_1.CreateVentaDto.create(req.body);
            if (errors)
                return res.status(400).json({
                    status: 'fail',
                    message: 'Los datos proporcionados no son válidos.',
                    errors,
                });
            try {
                const result = yield posgres_1.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    if (createVentaDto === null || createVentaDto === void 0 ? void 0 : createVentaDto.id_usuario) {
                        const usuarioExists = yield tx.usuario.findUnique({
                            where: {
                                id_usuario: createVentaDto.id_usuario,
                            },
                        });
                        if (!usuarioExists) {
                            throw new Error('El usuario seleccionado no es válido o no existe.');
                        }
                    }
                    let totalVenta = 0;
                    const detallesParaGuardar = [];
                    for (const item of createVentaDto.productos) {
                        const productoDB = yield tx.producto.findUnique({
                            where: { id_producto: item.id_producto },
                        });
                        if (!productoDB || !productoDB.activo) {
                            throw new Error(`Producto con ID ${item.id_producto} no encontrado o inactivo.`);
                        }
                        if (productoDB.stock_actual < item.cantidad) {
                            throw new Error(`Stock insuficiente para el producto: ${productoDB.nombre}. Stock disponible: ${productoDB.stock_actual}`);
                        }
                        const subtotal = Number(productoDB.precio_venta) * item.cantidad;
                        totalVenta += subtotal;
                        detallesParaGuardar.push({
                            id_producto: item.id_producto,
                            cantidad: item.cantidad,
                            precio_unitario: productoDB.precio_venta,
                            subtotal,
                        });
                        yield tx.producto.update({
                            where: { id_producto: item.id_producto },
                            data: { stock_actual: { decrement: item.cantidad } },
                        });
                    }
                    const venta = yield tx.venta.create({
                        data: {
                            total: totalVenta,
                            id_usuario: createVentaDto.id_usuario,
                            metodo_pago: createVentaDto.metodo_pago,
                            detalles: {
                                create: detallesParaGuardar,
                            },
                        },
                        select: {
                            id_venta: true,
                            id_usuario: true,
                            fecha_hora: true,
                            total: true,
                            metodo_pago: true,
                            usuario: {
                                select: { id_usuario: true, nombre: true },
                            },
                            detalles: {
                                select: {
                                    id_detalle_venta_producto: true,
                                    id_producto: true,
                                    cantidad: true,
                                    precio_unitario: true,
                                    subtotal: true,
                                    producto: {
                                        select: { nombre: true },
                                    },
                                },
                            },
                        },
                    });
                    return venta;
                }));
                return res.status(201).json({
                    status: 'success',
                    message: 'Venta creada correctamente',
                    data: result,
                });
            }
            catch (e) {
                return res.status(400).json({
                    status: 'fail',
                    message: e.message || 'Error al procesar la venta.',
                    errors: null,
                });
            }
        });
        this.updateVenta = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            const [errors, updateVentaDto] = dtos_1.UpdateVentaDto.create(Object.assign(Object.assign({}, req.body), { id }));
            if (errors)
                return res.status(400).json({
                    status: 'fail',
                    message: 'Los datos proporcionados no son válidos.',
                    errors,
                });
            try {
                const exists = yield posgres_1.prisma.venta.findUnique({
                    where: { id_venta: id },
                });
                if (!exists)
                    return res.status(404).json({
                        status: 'fail',
                        message: `Venta with ID ${id} not found`,
                        errors: null,
                    });
                if (updateVentaDto === null || updateVentaDto === void 0 ? void 0 : updateVentaDto.id_usuario) {
                    const usuarioExists = yield posgres_1.prisma.usuario.findUnique({
                        where: {
                            id_usuario: updateVentaDto.id_usuario,
                        },
                    });
                    if (!usuarioExists) {
                        return res.status(400).json({
                            status: 'fail',
                            message: 'El usuario seleccionado no es válido.',
                            errors: null,
                        });
                    }
                }
                const venta = yield posgres_1.prisma.venta.update({
                    where: { id_venta: id },
                    data: updateVentaDto.values,
                    select: {
                        id_venta: true,
                        id_usuario: true,
                        fecha_hora: true,
                        total: true,
                        metodo_pago: true,
                        usuario: {
                            select: { id_usuario: true, nombre: true },
                        },
                        detalles: true,
                    },
                });
                return res.json({
                    status: 'success',
                    message: 'Venta actualizada correctamente',
                    data: venta,
                });
            }
            catch (e) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al actualizar venta',
                    errors: null,
                    e: e,
                });
            }
        });
    }
}
exports.VentasController = VentasController;
