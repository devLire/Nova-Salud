import { Request, Response } from 'express';
import { prisma } from '../../data/posgres';
import {
  CreateUserDto,
  UpdateUserDto,
  GetUsersDto,
  GetUserByIdDto,
} from '../../domain/dtos';

export class UserController {
  constructor() {}

  public getUsers = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [errors, getUsersDto] = GetUsersDto.create(+page, +limit);
    if (errors)
      return res
        .status(400)
        .json({
          status: 'fail',
          message: 'Los datos proporcionados no son válidos.',
          errors,
        });
    try {
      const [users, total] = await Promise.all([
        prisma.usuario.findMany({
          where: { activo: true },
          skip: (getUsersDto!.page - 1) * getUsersDto!.limit,
          take: getUsersDto!.limit,
          select: { id_usuario: true, nombre: true, email: true, rol: true },
        }),
        prisma.usuario.count({ where: { activo: true } })
      ]);

      const hasNext = (getUsersDto!.page * getUsersDto!.limit) < total;

      return res.json({
        status: 'success',
        message: 'Usuarios obtenidos correctamente',
        data: users,
        pagination: {
          page: getUsersDto!.page,
          limit: getUsersDto!.limit,
          total,
          next: hasNext ? `/api/users?page=${getUsersDto!.page + 1}&limit=${getUsersDto!.limit}` : null,
          prev: getUsersDto!.page > 1 ? `/api/users?page=${getUsersDto!.page - 1}&limit=${getUsersDto!.limit}` : null,
        }
      });
    } catch (e) {
      return res
        .status(500)
        .json({
          status: 'error',
          message: 'Error al obtener usuarios',
          errors: null,
        });
    }
  };

  public getUserByID = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [errors, getUserByIdDTO] = GetUserByIdDto.create(id);
    if (errors)
      return res
        .status(400)
        .json({
          status: 'fail',
          message: 'Los datos proporcionados no son válidos.',
          errors,
        });
    try {
      const user = await prisma.usuario.findUnique({
        where: {
          id_usuario: getUserByIdDTO!.id,
        },
        select: {
          id_usuario: true,
          nombre: true,
          rol: true,
          email: true,
        },
      });

      user
        ? res.json({
            status: 'success',
            message: 'Usuario obtenido correctamente',
            data: user,
          })
        : res
            .status(404)
            .json({
              status: 'fail',
              message: `User with id ${id} not found`,
              errors: null,
            });
    } catch (e) {
      return res
        .status(500)
        .json({
          status: 'error',
          message: 'Error al obtener usuario',
          errors: null,
        });
    }
  };

  public createUser = async (req: Request, res: Response) => {
    const [errors, createUserDto] = CreateUserDto.create(req.body);
    if (errors)
      return res
        .status(400)
        .json({
          status: 'fail',
          message: 'Los datos proporcionados no son válidos.',
          errors,
        });

    try {
      const existingUser = await prisma.usuario.findUnique({
        where: { email: createUserDto!.email },
      });

      if (existingUser) {
        return res
          .status(400)
          .json({
            status: 'fail',
            message: 'El email ya está registrado.',
            errors: { email: 'El email ya está registrado.' },
          });
      }

      const user = await prisma.usuario.create({
        data: {
          nombre: createUserDto!.nombre,
          email: createUserDto!.email,
          password: createUserDto!.password,
          rol: createUserDto!.rol as any,
        },
        select: {
          id_usuario: true,
          nombre: true,
          rol: true,
          email: true,
        },
      });
      res
        .status(201)
        .json({
          status: 'success',
          message: 'Usuario creado correctamente',
          data: user,
        });
    } catch (error) {
      res
        .status(500)
        .json({
          status: 'error',
          message: 'Error al crear usuario en el servidor.',
          errors: null,
        });
    }
  };

  public updateUser = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [errors, updateUser] = UpdateUserDto.create({ ...req.body, id });

    if (errors)
      return res
        .status(400)
        .json({
          status: 'fail',
          message: 'Los datos proporcionados no son válidos.',
          errors,
        });

    try {
      const user = await prisma.usuario.findUnique({
        where: { id_usuario: id },
      });

      if (!user)
        return res
          .status(404)
          .json({
            status: 'fail',
            message: `User with ID ${id} not found`,
            errors: null,
          });

      if (updateUser?.email) {
        const existingUser = await prisma.usuario.findFirst({
          where: {
            email: updateUser.email,
            NOT: { id_usuario: id },
          },
        });

        if (existingUser) {
          return res.status(400).json({
            status: 'fail',
            message: 'El email ya está registrado por otro usuario',
            errors: { email: 'El email ya está registrado por otro usuario' },
          });
        }
      }

      const updatedUser = await prisma.usuario.update({
        where: {
          id_usuario: id,
        },
        data: updateUser!.values,
        select: {
          id_usuario: true,
          nombre: true,
          rol: true,
          email: true,
        },
      });

      res.json({
        status: 'success',
        message: 'Usuario actualizado correctamente',
        data: updatedUser,
      });
    } catch (e) {
      res
        .status(500)
        .json({
          status: 'error',
          message: 'Error al actualizar usuario',
          errors: null,
        });
    }
  };

  public deleteUser = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [errors, getUserByIdDTO] = GetUserByIdDto.create(id);
    if (errors)
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son válidos.',
        errors,
      });

    try {
      const userExists = await prisma.usuario.findUnique({
        where: { id_usuario: id },
      });

      if (!userExists) {
        return res
          .status(404)
          .json({
            status: 'fail',
            message: `User with ID ${id} not found`,
            errors: null,
          });
      }

      const deletedUser = await prisma.usuario.update({
        where: {
          id_usuario: id,
        },
        data: {
          activo: false,
        },
        select: {
          id_usuario: true,
          nombre: true,
          rol: true,
          email: true,
        },
      });
      return res.json({
        status: 'success',
        message: 'Usuario eliminado correctamente',
        data: deletedUser,
      });
    } catch (e) {
      return res
        .status(500)
        .json({
          status: 'error',
          message: 'Error al eliminar usuario',
          errors: null,
        });
    }
  };
}
