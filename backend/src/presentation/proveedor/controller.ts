import { Request, Response } from 'express';
import { prisma } from '../../data/posgres';
import {
    GetProveedoresDto,
    GetProveedorByIdDto,
    CreateProveedorDto,
    UpdateProveedorDto
} from '../../domain/dtos';

export class ProveedorController {

    public getProveedores = async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [errors, dto] = GetProveedoresDto.create(+page, +limit);
        if (errors)
            return res.status(400).json({
                status: 'fail',
                message: 'Datos inválidos',
                errors,
            });

        try {
            const [proveedores, total] = await Promise.all([
                prisma.proveedor.findMany({
                    select: {
                        id_proveedor: true,
                        nombre_empresa: true,
                        contacto: true,
                        telefono: true,
                        activo: true
                    }
                }),
                prisma.proveedor.count({ where: { activo: true } })
            ]);

            return res.json({
                status: 'success',
                message: 'Proveedores obtenidos',
                data: proveedores,
                pagination: {
                    page: dto!.page,
                    limit: dto!.limit,
                    total,
                },
                errors: null
            });

        } catch (e) {
            console.log("🔥 ERROR REAL PROVEEDORES:", e);

            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener proveedores',
                errors: null
            });
        }
    };

    public getProveedorByID = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [errors, dto] = GetProveedorByIdDto.create(id);
        if (errors)
            return res.status(400).json({
                status: 'fail',
                message: 'ID inválido',
                errors,
            });

        try {
            const proveedor = await prisma.proveedor.findUnique({
                where: { id_proveedor: dto!.id }
            });

            if (!proveedor) {
                return res.status(404).json({
                    status: 'fail',
                    message: `Proveedor con ID ${id} no existe`,
                    errors: null
                });
            }

            return res.json({
                status: 'success',
                message: 'Proveedor obtenido',
                data: proveedor,
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

    public createProveedor = async (req: Request, res: Response) => {
        const [errors, createDto] = CreateProveedorDto.create(req.body);

        if (errors)
            return res.status(400).json({
                status: 'fail',
                message: 'Datos inválidos',
                errors
            });

        try {
            const proveedor = await prisma.proveedor.create({
                data: {
                    nombre_empresa: createDto!.nombre_empresa,
                    contacto: createDto!.contacto,
                    telefono: createDto!.telefono,
                    activo: true
                }
            });

            return res.status(201).json({
                status: 'success',
                message: 'Proveedor creado',
                data: proveedor,
                errors: null
            });

        } catch (e) {
            return res.status(500).json({
                status: 'error',
                message: 'Error al crear proveedor',
                errors: null
            });
        }
    };


    public updateProveedor = async (req: Request, res: Response) => {
        const id = +req.params.id;

        const [errors, updateDto] = UpdateProveedorDto.create({ ...req.body, id });

        if (errors)
            return res.status(400).json({
                status: 'fail',
                message: 'Datos inválidos',
                errors
            });

        try {
            const exists = await prisma.proveedor.findUnique({
                where: { id_proveedor: id }
            });

            if (!exists) {
                return res.status(404).json({
                    status: 'fail',
                    message: `Proveedor con ID ${id} no existe`,
                    errors: null
                });
            }

            const proveedor = await prisma.proveedor.update({
                where: { id_proveedor: id },
                data: updateDto!.values
            });

            return res.json({
                status: 'success',
                message: 'Proveedor actualizado',
                data: proveedor,
                errors: null
            });

        } catch (e) {
            return res.status(500).json({
                status: 'error',
                message: 'Error al actualizar proveedor',
                errors: null
            });
        }
    };

    public deleteProveedor = async (req: Request, res: Response) => {
        const id = +req.params.id;

        try {
            const exists = await prisma.proveedor.findUnique({
                where: { id_proveedor: id }
            });

            if (!exists) {
                return res.status(404).json({
                    status: 'fail',
                    message: `Proveedor con ID ${id} no existe`,
                    errors: null
                });
            }

            const proveedor = await prisma.proveedor.update({
                where: { id_proveedor: id },
                data: { activo: false }
            });

            return res.json({
                status: 'success',
                message: 'Proveedor eliminado',
                data: proveedor,
                errors: null
            });

        } catch (e) {
            return res.status(500).json({
                status: 'error',
                message: 'Error al eliminar proveedor',
                errors: null
            });
        }
    };
}