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
exports.ProductosController = void 0;
const posgres_1 = require("../../data/posgres");
const dtos_1 = require("../../domain/dtos");
class ProductosController {
    constructor() {
        this.getProductos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10, search = '' } = req.query;
            const [errors, getProductosDto] = dtos_1.GetProductosDto.create(+page, +limit);
            if (errors)
                return res.status(400).json({
                    status: 'fail',
                    message: 'Los datos proporcionados no son válidos.',
                    errors,
                });
            try {
                const whereClause = {
                    activo: true,
                };
                if (search) {
                    whereClause.OR = [
                        { nombre: { contains: String(search), mode: 'insensitive' } },
                        { codigo_barras: { contains: String(search) } },
                    ];
                }
                const [productos, total] = yield Promise.all([
                    posgres_1.prisma.producto.findMany({
                        where: whereClause,
                        skip: (getProductosDto.page - 1) * getProductosDto.limit,
                        take: getProductosDto.limit,
                        select: {
                            id_producto: true,
                            nombre: true,
                            descripcion: true,
                            precio_venta: true,
                            stock_actual: true,
                            stock_minimo: true,
                            codigo_barras: true,
                            categoria: {
                                select: { id_categoria: true, nombre: true },
                            },
                            proveedor: {
                                select: { id_proveedor: true, nombre_empresa: true },
                            },
                        },
                    }),
                    posgres_1.prisma.producto.count({ where: whereClause }),
                ]);
                const hasNext = getProductosDto.page * getProductosDto.limit < total;
                const searchParam = search
                    ? `&search=${encodeURIComponent(String(search))}`
                    : '';
                return res.json({
                    status: 'success',
                    message: 'Productos obtenidos correctamente',
                    data: productos,
                    pagination: {
                        page: getProductosDto.page,
                        limit: getProductosDto.limit,
                        total,
                        next: hasNext
                            ? `/api/productos?page=${getProductosDto.page + 1}&limit=${getProductosDto.limit}${searchParam}`
                            : null,
                        prev: getProductosDto.page > 1
                            ? `/api/productos?page=${getProductosDto.page - 1}&limit=${getProductosDto.limit}${searchParam}`
                            : null,
                    },
                });
            }
            catch (e) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al obtener productos',
                    errors: null,
                    e: e,
                });
            }
        });
        this.getProductoByID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            const [errors, getProductoByIdDto] = dtos_1.GetProductoByIdDto.create(id);
            if (errors)
                return res.status(400).json({
                    status: 'fail',
                    message: 'Los datos proporcionados no son válidos.',
                    errors,
                });
            try {
                const producto = yield posgres_1.prisma.producto.findUnique({
                    where: { id_producto: getProductoByIdDto.id },
                    select: {
                        id_producto: true,
                        nombre: true,
                        descripcion: true,
                        precio_venta: true,
                        stock_actual: true,
                        stock_minimo: true,
                        codigo_barras: true,
                        categoria: {
                            select: { id_categoria: true, nombre: true },
                        },
                        proveedor: {
                            select: { id_proveedor: true, nombre_empresa: true },
                        },
                    },
                });
                if (!producto) {
                    return res.status(404).json({
                        status: 'fail',
                        message: `Producto with ID ${id} not found`,
                        errors: null,
                    });
                }
                return res.json({
                    status: 'success',
                    message: 'Producto obtenido correctamente',
                    data: producto,
                });
            }
            catch (e) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al obtener producto',
                    errors: null,
                });
            }
        });
        this.createProducto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [errors, createProductoDto] = dtos_1.CreateProductoDto.create(req.body);
            if (errors)
                return res.status(400).json({
                    status: 'fail',
                    message: 'Los datos proporcionados no son válidos.',
                    errors,
                });
            try {
                const existingProduct = yield posgres_1.prisma.producto.findFirst({
                    where: {
                        nombre: createProductoDto.nombre,
                    },
                });
                if (existingProduct)
                    return res.status(400).json({
                        status: 'fail',
                        message: 'El nombre del producto ya existe',
                        errors: null,
                    });
                const [catExists, provExists] = yield Promise.all([
                    posgres_1.prisma.categoria.findFirst({
                        where: {
                            id_categoria: createProductoDto.id_categoria,
                            activo: true,
                        },
                    }),
                    posgres_1.prisma.proveedor.findFirst({
                        where: {
                            id_proveedor: createProductoDto.id_proveedor,
                            activo: true,
                        },
                    }),
                ]);
                if (!catExists || !provExists) {
                    return res.status(400).json({
                        status: 'fail',
                        message: 'La categoría o el proveedor seleccionados no son válidos o están inactivos.',
                        errors: null,
                    });
                }
                const producto = yield posgres_1.prisma.producto.create({
                    data: {
                        nombre: createProductoDto.nombre,
                        precio_venta: createProductoDto.precio_venta,
                        id_categoria: createProductoDto.id_categoria,
                        id_proveedor: createProductoDto.id_proveedor,
                        codigo_barras: createProductoDto.codigo_barras,
                        descripcion: createProductoDto.descripcion,
                        stock_actual: createProductoDto.stock_actual,
                        stock_minimo: createProductoDto.stock_minimo,
                        activo: true,
                    },
                    select: {
                        id_producto: true,
                        nombre: true,
                        descripcion: true,
                        precio_venta: true,
                        stock_actual: true,
                        stock_minimo: true,
                        codigo_barras: true,
                        categoria: {
                            select: { id_categoria: true, nombre: true },
                        },
                        proveedor: {
                            select: { id_proveedor: true, nombre_empresa: true },
                        },
                    },
                });
                return res.status(201).json({
                    status: 'success',
                    message: 'Producto creado correctamente',
                    data: producto,
                });
            }
            catch (e) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al crear producto en el servidor',
                    errors: null,
                });
            }
        });
        this.updateProducto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            const [errors, updateProductoDto] = dtos_1.UpdateProductoDto.create(Object.assign(Object.assign({}, req.body), { id }));
            if (errors)
                return res.status(400).json({
                    status: 'fail',
                    message: 'Los datos proporcionados no son válidos.',
                    errors,
                });
            try {
                const exists = yield posgres_1.prisma.producto.findUnique({
                    where: { id_producto: id },
                });
                if (!exists)
                    return res.status(404).json({
                        status: 'fail',
                        message: `Producto with ID ${id} not found`,
                        errors: null,
                    });
                if (updateProductoDto === null || updateProductoDto === void 0 ? void 0 : updateProductoDto.nombre) {
                    const existingProduct = yield posgres_1.prisma.producto.findFirst({
                        where: {
                            nombre: updateProductoDto.nombre,
                            NOT: {
                                id_producto: updateProductoDto.id,
                            },
                        },
                    });
                    if (existingProduct)
                        return res.status(400).json({
                            status: 'fail',
                            message: 'El nombre del producto ya existe',
                            errors: null,
                        });
                }
                if (updateProductoDto === null || updateProductoDto === void 0 ? void 0 : updateProductoDto.id_categoria) {
                    const catExists = yield posgres_1.prisma.categoria.findFirst({
                        where: {
                            id_categoria: updateProductoDto.id_categoria,
                            activo: true,
                        },
                    });
                    if (!catExists) {
                        return res.status(400).json({
                            status: 'fail',
                            message: 'La categoría seleccionada no es válida o está inactiva.',
                            errors: null,
                        });
                    }
                }
                if (updateProductoDto === null || updateProductoDto === void 0 ? void 0 : updateProductoDto.id_proveedor) {
                    const provExists = yield posgres_1.prisma.proveedor.findFirst({
                        where: {
                            id_proveedor: updateProductoDto.id_proveedor,
                            activo: true,
                        },
                    });
                    if (!provExists) {
                        return res.status(400).json({
                            status: 'fail',
                            message: 'El proveedor seleccionado no es válido o está inactivo.',
                            errors: null,
                        });
                    }
                }
                const producto = yield posgres_1.prisma.producto.update({
                    where: { id_producto: id },
                    data: updateProductoDto.values,
                    select: {
                        id_producto: true,
                        nombre: true,
                        descripcion: true,
                        precio_venta: true,
                        stock_actual: true,
                        stock_minimo: true,
                        codigo_barras: true,
                        categoria: {
                            select: { id_categoria: true, nombre: true },
                        },
                        proveedor: {
                            select: { id_proveedor: true, nombre_empresa: true },
                        },
                    },
                });
                return res.json({
                    status: 'success',
                    message: 'Producto actualizado correctamente',
                    data: producto,
                });
            }
            catch (e) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al actualizar producto',
                    errors: null,
                    e: e,
                });
            }
        });
        this.deleteProducto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            const [errors, getProductoByIdDto] = dtos_1.GetProductoByIdDto.create(id);
            if (errors)
                return res.status(400).json({
                    status: 'fail',
                    message: 'Los datos proporcionados no son válidos.',
                    errors,
                });
            try {
                const exists = yield posgres_1.prisma.producto.findUnique({
                    where: { id_producto: getProductoByIdDto.id },
                });
                if (!exists)
                    return res.status(404).json({
                        status: 'fail',
                        message: `Producto with ID ${getProductoByIdDto.id} not found`,
                        errors: null,
                    });
                const producto = yield posgres_1.prisma.producto.update({
                    where: { id_producto: getProductoByIdDto.id },
                    data: { activo: false },
                    select: {
                        id_producto: true,
                        nombre: true,
                    },
                });
                return res.json({
                    status: 'success',
                    message: 'Producto eliminado correctamente',
                    data: producto,
                });
            }
            catch (e) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al eliminar producto',
                    errors: null,
                });
            }
        });
        this.getAlertasStock = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const productos = yield posgres_1.prisma.producto.findMany({
                    where: { activo: true },
                    include: {
                        proveedor: {
                            select: { nombre_empresa: true, telefono: true },
                        },
                        categoria: {
                            select: { nombre: true },
                        },
                    },
                });
                const productosEnAlerta = productos
                    .filter((p) => p.stock_actual <= p.stock_minimo)
                    .sort((a, b) => a.stock_actual - b.stock_actual);
                return res.json({
                    status: 'success',
                    message: 'Reporte de alertas de stock generado correctamente',
                    data: productosEnAlerta,
                    count: productosEnAlerta.length,
                });
            }
            catch (e) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al generar el reporte de alertas',
                    errors: null,
                    e: e,
                });
            }
        });
    }
}
exports.ProductosController = ProductosController;
