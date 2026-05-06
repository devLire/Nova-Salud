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
exports.CategoriasController = void 0;
const posgres_1 = require("../../data/posgres");
const dtos_1 = require("../../domain/dtos");
class CategoriasController {
    constructor() {
        this.getCategorias = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10, search = '' } = req.query;
            const [errors, getCategoriasDto] = dtos_1.GetCategoriasDto.create(+page, +limit);
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
                    ];
                }
                const [categorias, total] = yield Promise.all([
                    posgres_1.prisma.categoria.findMany({
                        where: whereClause,
                        skip: (getCategoriasDto.page - 1) * getCategoriasDto.limit,
                        take: getCategoriasDto.limit,
                        select: {
                            id_categoria: true,
                            nombre: true,
                            descripcion: true,
                        },
                    }),
                    posgres_1.prisma.categoria.count({ where: whereClause }),
                ]);
                const hasNext = getCategoriasDto.page * getCategoriasDto.limit < total;
                const searchParam = search
                    ? `&search=${encodeURIComponent(String(search))}`
                    : '';
                return res.json({
                    status: 'success',
                    message: 'Categoras obtenidas correctamente',
                    data: categorias,
                    pagination: {
                        page: getCategoriasDto.page,
                        limit: getCategoriasDto.limit,
                        total,
                        next: hasNext
                            ? `/api/categorias?page=${getCategoriasDto.page + 1}&limit=${getCategoriasDto.limit}${searchParam}`
                            : null,
                        prev: getCategoriasDto.page > 1
                            ? `/api/categorias?page=${getCategoriasDto.page - 1}&limit=${getCategoriasDto.limit}${searchParam}`
                            : null,
                    },
                });
            }
            catch (e) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al obtener categorías',
                    errors: null,
                });
            }
        });
        this.getCategoriaByID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            const [errors, getCategoriaByIdDto] = dtos_1.GetCategoriaByIdDto.create(id);
            if (errors)
                return res.status(400).json({
                    status: 'fail',
                    message: 'Los datos proporcionados no son válidos.',
                    errors,
                });
            try {
                const categoria = yield posgres_1.prisma.categoria.findUnique({
                    where: { id_categoria: getCategoriaByIdDto.id },
                    select: {
                        id_categoria: true,
                        nombre: true,
                        descripcion: true,
                    },
                });
                if (!categoria) {
                    return res.status(404).json({
                        status: 'fail',
                        message: `Categoria with ID ${id} not found`,
                        errors: null,
                    });
                }
                return res.json({
                    status: 'success',
                    message: 'Categoría obtenida correctamente',
                    data: categoria,
                });
            }
            catch (e) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al obtener categoría',
                    errors: null,
                });
            }
        });
        this.createCategoria = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [errors, createCategoriaDto] = dtos_1.CreateCategoriaDto.create(req.body);
            if (errors)
                return res.status(400).json({
                    status: 'fail',
                    message: 'Los datos proporcionados no son válidos.',
                    errors,
                });
            try {
                const existingCategory = yield posgres_1.prisma.categoria.findFirst({
                    where: {
                        nombre: createCategoriaDto.nombre,
                    },
                });
                if (existingCategory)
                    return res.status(400).json({
                        status: 'fail',
                        message: 'El nombre de la categoría ya existe',
                        errors: null,
                    });
                const categoria = yield posgres_1.prisma.categoria.create({
                    data: {
                        nombre: createCategoriaDto.nombre,
                        descripcion: createCategoriaDto.descripcion,
                        activo: true,
                    },
                    select: {
                        id_categoria: true,
                        nombre: true,
                        descripcion: true,
                    },
                });
                return res.status(201).json({
                    status: 'success',
                    message: 'Categoría creada correctamente',
                    data: categoria,
                });
            }
            catch (e) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al crear categoría en el servidor',
                    errors: null,
                });
            }
        });
        this.updateCategoria = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            const [errors, updateCategoriaDto] = dtos_1.UpdateCategoriaDto.create(Object.assign(Object.assign({}, req.body), { id }));
            if (errors)
                return res.status(400).json({
                    status: 'fail',
                    message: 'Los datos proporcionados no son válidos.',
                    errors,
                });
            try {
                const exists = yield posgres_1.prisma.categoria.findUnique({
                    where: { id_categoria: id },
                });
                if (!exists)
                    return res.status(404).json({
                        status: 'fail',
                        message: `Categoria with ID ${id} not found`,
                        errors: null,
                    });
                if (updateCategoriaDto === null || updateCategoriaDto === void 0 ? void 0 : updateCategoriaDto.nombre) {
                    const existingCategory = yield posgres_1.prisma.categoria.findFirst({
                        where: {
                            nombre: updateCategoriaDto.nombre,
                            NOT: {
                                id_categoria: updateCategoriaDto.id,
                            },
                        },
                    });
                    if (existingCategory)
                        return res.status(400).json({
                            status: 'fail',
                            message: 'El nombre de la categoría ya existe',
                            errors: null,
                        });
                }
                const categoria = yield posgres_1.prisma.categoria.update({
                    where: { id_categoria: id },
                    data: updateCategoriaDto.values,
                    select: {
                        id_categoria: true,
                        nombre: true,
                        descripcion: true,
                    },
                });
                return res.json({
                    status: 'success',
                    message: 'Categoría actualizada correctamente',
                    data: categoria,
                });
            }
            catch (e) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al actualizar categoría',
                    errors: null,
                });
            }
        });
        this.deleteCategoria = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            const [errors, getCategoriaByIdDto] = dtos_1.GetCategoriaByIdDto.create(id);
            if (errors)
                return res.status(400).json({
                    status: 'fail',
                    message: 'Los datos proporcionados no son válidos.',
                    errors,
                });
            try {
                const exists = yield posgres_1.prisma.categoria.findUnique({
                    where: { id_categoria: getCategoriaByIdDto.id },
                });
                if (!exists)
                    return res.status(404).json({
                        status: 'fail',
                        message: `Categoria with ID ${getCategoriaByIdDto.id} not found`,
                        errors: null,
                    });
                const categoria = yield posgres_1.prisma.categoria.update({
                    where: { id_categoria: getCategoriaByIdDto.id },
                    data: { activo: false },
                    select: {
                        id_categoria: true,
                        nombre: true,
                        descripcion: true,
                    },
                });
                return res.json({
                    status: 'success',
                    message: 'Categoría eliminada correctamente',
                    data: categoria,
                });
            }
            catch (e) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al eliminar categoría',
                    errors: null,
                });
            }
        });
    }
}
exports.CategoriasController = CategoriasController;
