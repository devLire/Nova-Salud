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
exports.IngresosController = void 0;
const posgres_1 = require("../../data/posgres");
const dtos_1 = require("../../domain/dtos");
class IngresosController {
    constructor() {
        this.getIngresos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10, search = '' } = req.query;
            const [errors, getIngresosDto] = dtos_1.GetIngresosDto.create(+page, +limit);
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
                        { producto: { nombre: { contains: String(search), mode: 'insensitive' } } },
                        { usuario: { nombre: { contains: String(search), mode: 'insensitive' } } },
                    ];
                }
                const [ingresos, total] = yield Promise.all([
                    posgres_1.prisma.ingreso_inventario.findMany({
                        where: whereClause,
                        skip: (getIngresosDto.page - 1) * getIngresosDto.limit,
                        take: getIngresosDto.limit,
                        select: {
                            id_inventario: true,
                            id_producto: true,
                            id_usuario: true,
                            cantidad_ingresada: true,
                            fecha_ingreso: true,
                            producto: {
                                select: {
                                    id_producto: true,
                                    nombre: true,
                                    proveedor: {
                                        select: { nombre_empresa: true },
                                    },
                                },
                            },
                            usuario: {
                                select: { id_usuario: true, nombre: true },
                            },
                        },
                        orderBy: { fecha_ingreso: 'desc' },
                    }),
                    posgres_1.prisma.ingreso_inventario.count({ where: whereClause }),
                ]);
                const hasNext = getIngresosDto.page * getIngresosDto.limit < total;
                const searchParam = search
                    ? `&search=${encodeURIComponent(String(search))}`
                    : '';
                return res.json({
                    status: 'success',
                    message: 'Ingresos obtenidos correctamente',
                    data: ingresos,
                    pagination: {
                        page: getIngresosDto.page,
                        limit: getIngresosDto.limit,
                        total,
                        next: hasNext
                            ? `/api/ingresos?page=${getIngresosDto.page + 1}&limit=${getIngresosDto.limit}${searchParam}`
                            : null,
                        prev: getIngresosDto.page > 1
                            ? `/api/ingresos?page=${getIngresosDto.page - 1}&limit=${getIngresosDto.limit}${searchParam}`
                            : null,
                    },
                });
            }
            catch (e) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al obtener ingresos',
                    errors: null,
                    e: e,
                });
            }
        });
        this.getIngresoByID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            const [errors, getIngresoByIdDto] = dtos_1.GetIngresoByIdDto.create(id);
            if (errors)
                return res.status(400).json({
                    status: 'fail',
                    message: 'Los datos proporcionados no son válidos.',
                    errors,
                });
            try {
                const ingreso = yield posgres_1.prisma.ingreso_inventario.findUnique({
                    where: { id_inventario: getIngresoByIdDto.id },
                    select: {
                        id_inventario: true,
                        id_producto: true,
                        id_usuario: true,
                        cantidad_ingresada: true,
                        fecha_ingreso: true,
                        producto: {
                            select: { id_producto: true, nombre: true },
                        },
                        usuario: {
                            select: { id_usuario: true, nombre: true },
                        },
                    },
                });
                if (!ingreso) {
                    return res.status(404).json({
                        status: 'fail',
                        message: `Ingreso with ID ${id} not found`,
                        errors: null,
                    });
                }
                return res.json({
                    status: 'success',
                    message: 'Ingreso obtenido correctamente',
                    data: ingreso,
                });
            }
            catch (e) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al obtener ingreso',
                    errors: null,
                });
            }
        });
        this.createIngreso = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [errors, createIngresoDto] = dtos_1.CreateIngresoDto.create(req.body);
            if (errors)
                return res.status(400).json({ status: 'fail', errors });
            try {
                const result = yield posgres_1.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    // 1. Verificar que el producto exista
                    const producto = yield tx.producto.findUnique({
                        where: { id_producto: createIngresoDto.id_producto },
                    });
                    if (!producto || !producto.activo) {
                        throw new Error('Producto no encontrado o inactivo');
                    }
                    if (createIngresoDto.id_usuario) {
                        const usuarioExists = yield tx.usuario.findUnique({
                            where: {
                                id_usuario: createIngresoDto.id_usuario,
                            },
                        });
                        if (!usuarioExists || !usuarioExists.activo) {
                            throw new Error('El usuario seleccionado no es válido o está inactivo.');
                        }
                    }
                    // 2. Registrar el ingreso en la tabla Ingreso_inventario
                    const nuevoIngreso = yield tx.ingreso_inventario.create({
                        data: {
                            id_producto: createIngresoDto.id_producto,
                            id_usuario: createIngresoDto.id_usuario,
                            cantidad_ingresada: createIngresoDto.cantidad_ingresada,
                        },
                        select: {
                            id_inventario: true,
                            id_producto: true,
                            id_usuario: true,
                            cantidad_ingresada: true,
                            fecha_ingreso: true,
                            producto: {
                                select: { nombre: true, stock_actual: true },
                            },
                            usuario: {
                                select: { nombre: true },
                            },
                        },
                    });
                    // 3. ACTUALIZAR EL STOCK (Aumentar)
                    yield tx.producto.update({
                        where: { id_producto: createIngresoDto.id_producto },
                        data: {
                            stock_actual: { increment: createIngresoDto.cantidad_ingresada },
                        },
                    });
                    nuevoIngreso.producto.stock_actual +=
                        createIngresoDto.cantidad_ingresada;
                    return nuevoIngreso;
                }));
                return res.status(201).json({
                    status: 'success',
                    message: 'Stock actualizado correctamente',
                    data: result,
                });
            }
            catch (e) {
                return res
                    .status(400)
                    .json({
                    status: 'fail',
                    message: e.message || 'Error al procesar el ingreso.',
                });
            }
        });
    }
}
exports.IngresosController = IngresosController;
