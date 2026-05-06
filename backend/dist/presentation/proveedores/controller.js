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
exports.ProveedorController = void 0;
const posgres_1 = require("../../data/posgres");
const dtos_1 = require("../../domain/dtos");
class ProveedorController {
    constructor() {
        this.getProveedores = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10, search = '' } = req.query;
            const [errors, getProveedoresDto] = dtos_1.GetProveedoresDto.create(+page, +limit);
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
                        { nombre_empresa: { contains: String(search), mode: 'insensitive' } },
                    ];
                }
                const [proveedores, total] = yield Promise.all([
                    posgres_1.prisma.proveedor.findMany({
                        where: whereClause,
                        skip: (getProveedoresDto.page - 1) * getProveedoresDto.limit,
                        take: getProveedoresDto.limit,
                        select: {
                            id_proveedor: true,
                            nombre_empresa: true,
                            contacto: true,
                            telefono: true,
                        },
                    }),
                    posgres_1.prisma.proveedor.count({ where: whereClause }),
                ]);
                const hasNext = getProveedoresDto.page * getProveedoresDto.limit < total;
                const searchParam = search
                    ? `&search=${encodeURIComponent(String(search))}`
                    : '';
                return res.json({
                    status: 'success',
                    message: 'Proveedores obtenidos correctamente',
                    data: proveedores,
                    pagination: {
                        page: getProveedoresDto.page,
                        limit: getProveedoresDto.limit,
                        total,
                        next: hasNext
                            ? `/api/proveedores?page=${getProveedoresDto.page + 1}&limit=${getProveedoresDto.limit}${searchParam}`
                            : null,
                        prev: getProveedoresDto.page > 1
                            ? `/api/proveedores?page=${getProveedoresDto.page - 1}&limit=${getProveedoresDto.limit}${searchParam}`
                            : null,
                    },
                });
            }
            catch (e) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al obtener proveedores',
                    errors: null,
                });
            }
        });
        this.getProveedorByID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            const [errors, getProveedorByIdDto] = dtos_1.GetProveedorByIdDto.create(id);
            if (errors)
                return res.status(400).json({
                    status: 'fail',
                    message: 'Los datos proporcionados no son válidos.',
                    errors,
                });
            try {
                const proveedor = yield posgres_1.prisma.proveedor.findUnique({
                    where: { id_proveedor: getProveedorByIdDto.id },
                    select: {
                        id_proveedor: true,
                        nombre_empresa: true,
                        contacto: true,
                        telefono: true,
                    },
                });
                if (!proveedor) {
                    return res.status(404).json({
                        status: 'fail',
                        message: `Proveedor with ID ${id} not found`,
                        errors: null,
                    });
                }
                return res.json({
                    status: 'success',
                    message: 'Proveedor obtenido correctamente',
                    data: proveedor,
                });
            }
            catch (e) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al obtener proveedores',
                    errors: null,
                });
            }
        });
        this.createProveedor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [errors, createProveedorDto] = dtos_1.CreateProveedorDto.create(req.body);
            if (errors)
                return res.status(400).json({
                    status: 'fail',
                    message: 'Los datos proporcionados no son válidos.',
                    errors,
                });
            try {
                const existingProveedor = yield posgres_1.prisma.proveedor.findFirst({
                    where: { nombre_empresa: createProveedorDto.nombre_empresa },
                });
                if (existingProveedor) {
                    return res.status(400).json({
                        status: 'fail',
                        message: 'El nombre de la empresa ya existe',
                        errors: null,
                    });
                }
                const proveedor = yield posgres_1.prisma.proveedor.create({
                    data: {
                        nombre_empresa: createProveedorDto.nombre_empresa,
                        contacto: createProveedorDto.contacto,
                        telefono: createProveedorDto.telefono,
                        activo: true,
                    },
                    select: {
                        id_proveedor: true,
                        nombre_empresa: true,
                        contacto: true,
                        telefono: true,
                    },
                });
                return res.status(201).json({
                    status: 'success',
                    message: 'Proveedor creado correctamente',
                    data: proveedor,
                });
            }
            catch (e) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al crear proveedores en el servidor',
                    errors: null,
                });
            }
        });
        this.updateProveedor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            const [errors, updateProveedorDto] = dtos_1.UpdateProveedorDto.create(Object.assign(Object.assign({}, req.body), { id }));
            if (errors)
                return res.status(400).json({
                    status: 'fail',
                    message: 'Los datos proporcionados no son válidos.',
                    errors,
                });
            try {
                const exists = yield posgres_1.prisma.proveedor.findUnique({
                    where: { id_proveedor: id },
                });
                if (!exists) {
                    return res.status(404).json({
                        status: 'fail',
                        message: `Proveedor with ID ${id} not found`,
                        errors: null,
                    });
                }
                if (updateProveedorDto === null || updateProveedorDto === void 0 ? void 0 : updateProveedorDto.nombre_empresa) {
                    const existingProveedor = yield posgres_1.prisma.proveedor.findFirst({
                        where: {
                            nombre_empresa: updateProveedorDto.nombre_empresa,
                            NOT: { id_proveedor: updateProveedorDto.id },
                        },
                    });
                    if (existingProveedor) {
                        return res.status(400).json({
                            status: 'fail',
                            message: 'El nombre de la empresa ya existe',
                            errors: null,
                        });
                    }
                }
                const proveedor = yield posgres_1.prisma.proveedor.update({
                    where: { id_proveedor: id },
                    data: updateProveedorDto.values,
                    select: {
                        id_proveedor: true,
                        nombre_empresa: true,
                        contacto: true,
                        telefono: true,
                    },
                });
                return res.json({
                    status: 'success',
                    message: 'Proveedor actualizado correctamente',
                    data: proveedor,
                });
            }
            catch (e) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al actualizar proveedores',
                    errors: null,
                });
            }
        });
        this.deleteProveedor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            const [errors, getProveedorByIdDto] = dtos_1.GetProveedorByIdDto.create(id);
            if (errors)
                return res.status(400).json({
                    status: 'fail',
                    message: 'Los datos proporcionados no son válidos.',
                    errors,
                });
            try {
                const exists = yield posgres_1.prisma.proveedor.findUnique({
                    where: { id_proveedor: getProveedorByIdDto.id },
                });
                if (!exists) {
                    return res.status(404).json({
                        status: 'fail',
                        message: `Proveedor with ID ${getProveedorByIdDto.id} not found`,
                        errors: null,
                    });
                }
                const proveedor = yield posgres_1.prisma.proveedor.update({
                    where: { id_proveedor: getProveedorByIdDto.id },
                    data: { activo: false },
                    select: {
                        id_proveedor: true,
                        nombre_empresa: true,
                        contacto: true,
                        telefono: true,
                    },
                });
                return res.json({
                    status: 'success',
                    message: 'Proveedor eliminado correctamente',
                    data: proveedor,
                });
            }
            catch (e) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al eliminar proveedores',
                    errors: null,
                });
            }
        });
    }
}
exports.ProveedorController = ProveedorController;
