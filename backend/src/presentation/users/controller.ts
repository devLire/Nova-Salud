import { Request, Response } from 'express';
import { prisma } from '../../data/posgres';

export class UserController {
  constructor() {}

  public getUsers = async (req: Request, res: Response) => {
    try {
      const users = await prisma.usuario.findMany({
        where: {
          activo: true,
        },
        select: {
          id_usuario: true,
          nombre: true,
          rol: true,
          email: true,
        },
      });
      return res.json(users);
    } catch (e) {
      return res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  };

  public getUserByID = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id))
      return res.status(400).json({ error: 'ID argument is not a number.' });

    try {
      const user = await prisma.usuario.findUnique({
        where: {
          id_usuario: id,
        },
        select: {
          id_usuario: true,
          nombre: true,
          rol: true,
          email: true,
          activo: true,
        },
      });

      user
        ? res.json(user)
        : res.status(404).json({ error: `User with id ${id} not found` });
    } catch (e) {
      return res.status(500).json({ error: 'Error al obtener usuario' });
    }
  };

  public createUser = async (req: Request, res: Response) => {
    const { nombre, rol, email, password } = req.body;

    const errors: { [key: string]: string } = {};

    //Validación de nombre
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      errors.nombre = 'El campo "nombre" es obligatorio.';
    }

    // Validación de rol (Presencia y formato)
    const allowedRoles = ['ADMINISTRADOR', 'CAJERO', 'INVENTARIO'];
    if (!rol || typeof rol !== 'string' || rol.trim() === '') {
      errors.rol = 'El campo "rol" es obligatorio.';
    } else if (!allowedRoles.includes(rol.trim().toUpperCase())) {
      errors.rol = `El campo "rol" debe ser uno de: ${allowedRoles.join(', ')}.`;
    }

    //Validación de email
    if (!email || typeof email !== 'string' || email.trim() === '') {
      errors.email = 'El campo "email" es obligatorio.';
    } else {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        errors.email = 'El campo "email" debe ser un correo válido.';
      } else {
        // Verificación de disponibilidad en la base de datos integrada
        const existingUser = await prisma.usuario.findUnique({
          where: { email: email.trim().toLowerCase() },
        });
        if (existingUser) {
          errors.email = 'El email ya está registrado.';
        }
      }
    }

    //Validación de password
    if (!password || typeof password !== 'string' || password.trim() === '') {
      errors.password = 'El campo "password" es obligatorio.';
    } else if (password.length < 6) {
      errors.password = 'El campo "password" debe tener al menos 6 caracteres.';
    }

    // Si hay cualquier error acumulado, respondemos de inmediato
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const normalizedRol = rol.trim().toUpperCase();
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const user = await prisma.usuario.create({
        data: {
          nombre: nombre.trim(),
          rol: normalizedRol,
          email: normalizedEmail,
          password: password,
        },
        select: {
          id_usuario: true,
          nombre: true,
          rol: true,
          email: true,
          activo: true,
        },
      });

      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear usuario en el servidor.' });
    }
  };

  public updateUser = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id))
      return res.status(400).json({ error: 'ID argument is not a number.' });

    try {
      const user = await prisma.usuario.findUnique({
        where: { id_usuario: id },
      });

      if (!user)
        return res.status(404).json({ error: `User with ID ${id} not found` });

      const { nombre, rol, email, password } = req.body;

      if (email !== undefined) {
        const normalizedEmail =
          typeof email === 'string' ? email.trim().toLowerCase() : email;

        const existingUser = await prisma.usuario.findFirst({
          where: {
            email: normalizedEmail,
            NOT: {
              id_usuario: id,
            },
          },
        });

        if (existingUser) {
          return res
            .status(400)
            .json({ error: 'El email ya está registrado por otro usuario' });
        }

        req.body.email = normalizedEmail;
      }

      if (rol !== undefined) {
        const allowedRoles = ['ADMINISTRADOR', 'CAJERO', 'INVENTARIO'];
        if (
          typeof rol !== 'string' ||
          !allowedRoles.includes(rol.trim().toUpperCase())
        ) {
          return res.status(400).json({
            errors: {
              rol: `El campo "rol" debe ser uno de: ${allowedRoles.join(', ')}.`,
            },
          });
        }
      }

      const normalizedRol =
        typeof rol === 'string' ? rol.trim().toUpperCase() : rol;

      const updatedUser = await prisma.usuario.update({
        where: {
          id_usuario: id,
        },
        data: {
          nombre: nombre,
          rol: normalizedRol,
          email: email,
          password: password,
        },
        select: {
          id_usuario: true,
          nombre: true,
          rol: true,
          email: true,
        },
      });

      res.json(updatedUser);
    } catch (e) {
      res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  };

  public deleteUser = async (req: Request, res: Response) => {
    const id = +req.params.id;

    if (isNaN(id))
      return res.status(400).json({ error: 'ID argument is not a number.' });

    try {
      const userExists = await prisma.usuario.findUnique({
        where: { id_usuario: id },
      });

      if (!userExists) {
        return res.status(404).json({ error: `User with ID ${id} not found` });
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
      return res.json(deletedUser);
    } catch (e) {
      return res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  };
}
