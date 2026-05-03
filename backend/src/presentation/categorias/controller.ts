import { Request, Response } from 'express';
import { prisma } from '../../data/posgres';
import {
    GetCategoriasDto,
    GetCategoriaByIdDto,
    CreateCategoriaDto,
    UpdateCategoriaDto
} from '../../domain/dtos';

export class CategoriasController {

    public getCategorias = async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [errors, dto] = GetCategoriasDto.create(+page, +limit);

        if (errors)
            return res.status(400).json({
                status: 'fail',
                message: 'Datos inválidos',
                errors,
            });

        try {
            const [categorias, total] = await Promise.all([
                prisma.categoria.findMany({
                    where: { activo: true },
                    skip: (dto!.page - 1) * dto!.limit,
                    take: dto!.limit,
                }),
                prisma.categoria.count({ where: { activo: true } })
            ]);

            return res.json({
                status: 'success',
                message: 'Categorías obtenidas',
                data: categorias,
                pagination: {
                    page: dto!.page,
                    limit: dto!.limit,
                    total,
                },
                errors: null
            });

        } catch (e) {
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener categorías',
                errors: null
            });
        }
    };

    public getCategoriaByID = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [errors, dto] = GetCategoriaByIdDto.create(id);

        if (errors)
            return res.status(400).json({
                status: 'fail',
                message: 'ID inválido',
                errors,
            });

        try {
            const categoria = await prisma.categoria.findUnique({
                where: { id_categoria: dto!.id }
            });

            if (!categoria) {
                return res.status(404).json({
                    status: 'fail',
                    message: `Categoría con ID ${id} no existe`,
                    errors: null
                });
            }

            return res.json({
                status: 'success',
                message: 'Categoría obtenida',
                data: categoria,
                errors: null
            });

        } catch (e) {
            return res.status(500).json({
                status: 'error',
                message: 'Error del servidor',
                errors: null
            });
        }
    };

    public createCategoria = async (req: Request, res: Response) => {
        const [errors, dto] = CreateCategoriaDto.create(req.body);

        if (errors)
            return res.status(400).json({
                status: 'fail',
                message: 'Datos inválidos',
                errors
            });

        try {
            const categoria = await prisma.categoria.create({
                data: {
                    nombre: dto!.nombre,
                    descripcion: dto!.descripcion,
                    activo: true
                }
            });

            return res.status(201).json({
                status: 'success',
                message: 'Categoría creada',
                data: categoria,
                errors: null
            });

        } catch (e) {
            return res.status(500).json({
                status: 'error',
                message: 'Error al crear categoría',
                errors: null
            });
        }
    };

    public updateCategoria = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [errors, dto] = UpdateCategoriaDto.create({ ...req.body, id });

        if (errors)
            return res.status(400).json({
                status: 'fail',
                message: 'Datos inválidos',
                errors
            });

        try {
            const exists = await prisma.categoria.findUnique({
                where: { id_categoria: id }
            });

            if (!exists)
                return res.status(404).json({
                    status: 'fail',
                    message: `Categoría con ID ${id} no existe`,
                    errors: null
                });

            const categoria = await prisma.categoria.update({
                where: { id_categoria: id },
                data: dto!.values
            });

            return res.json({
                status: 'success',
                message: 'Categoría actualizada',
                data: categoria,
                errors: null
            });

        } catch (e) {
            return res.status(500).json({
                status: 'error',
                message: 'Error al actualizar categoría',
                errors: null
            });
        }
    };

    public deleteCategoria = async (req: Request, res: Response) => {
        const id = +req.params.id;

        try {
            const exists = await prisma.categoria.findUnique({
                where: { id_categoria: id }
            });

            if (!exists)
                return res.status(404).json({
                    status: 'fail',
                    message: `Categoría con ID ${id} no existe`,
                    errors: null
                });

            const categoria = await prisma.categoria.update({
                where: { id_categoria: id },
                data: { activo: false }
            });

            return res.json({
                status: 'success',
                message: 'Categoría eliminada',
                data: categoria,
                errors: null
            });

        } catch (e) {
            return res.status(500).json({
                status: 'error',
                message: 'Error al eliminar categoría',
                errors: null
            });
        }
    };
}