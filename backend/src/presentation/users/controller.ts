import { Request, Response, text } from 'express';

const users = [
  {
    id: 1,
    nombre: 'Juan',
    rol: 'Administrador',
    email: 'juan@ejemplo.com',
    password: 'qwerty',
  },
  {
    id: 2,
    nombre: 'María',
    rol: 'Usuario',
    email: 'maria@ejemplo.com',
    password: 'abc123',
  },
  {
    id: 3,
    nombre: 'Carlos',
    rol: 'Proveedor',
    email: 'carlos@ejemplo.com',
    password: 'passw0rd',
  },
];

export class UserController {
  constructor() {}

  public getUsers = (req: Request, res: Response) => {
    return res.json(users);
  };

  public getUserByID = (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id))
      return res.status(400).json({ error: 'ID argument is not a number.' });

    const user = users.find((user) => user.id === id);

    user
      ? res.json(user)
      : res.status(404).json({ error: `Use with id ${id} not found` });
  };

  public createUser = (req: Request, res: Response) => {
    const { nombre, rol, email, password } = req.body;

    const errors: { [key: string]: string } = {};

    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      errors.nombre = 'El campo "nombre" es obligatorio.';
    }

    if (!rol || typeof rol !== 'string' || rol.trim() === '') {
      errors.rol = 'El campo "rol" es obligatorio.';
    }

    if (!email || typeof email !== 'string' || email.trim() === '') {
      errors.email = 'El campo "email" es obligatorio.';
    } else {
      // validación de formato de email
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        errors.email = 'El campo "email" debe ser un correo válido.';
      }
    }

    if (!password || typeof password !== 'string' || password.trim() === '') {
      errors.password = 'El campo "password" es obligatorio.';
    } else if (password.length < 6) {
      errors.password = 'El campo "password" debe tener al menos 6 caracteres.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const newUser = {
      id: users.length + 1,
      nombre: nombre,
      rol: rol,
      email: email,
      password: password,
    };

    users.push(newUser);

    res.json(newUser);
  };

  public updateUser = (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id))
      return res.status(400).json({ error: 'ID argument is not a number.' });

    const user = users.find((user) => user.id === id);
    if (!user)
      return res.status(404).json({ error: `User with ID ${id} not found` });

    const { nombre, rol, email, password } = req.body;

    user.nombre = nombre || user.nombre;
    user.rol = rol || user.rol;
    user.email = email || user.email;
    user.password = password || user.password;

    res.json(user);
  };

  public deleteUser = (req: Request, res: Response) => {
    const id = +req.params.id;

    if (isNaN(id))
      return res.status(400).json({ error: 'ID argument is not a number.' });

    const deletedUser = users.find((user) => user.id === id);
    if (!deletedUser)
      return res.status(404).json({ error: `User with id ${id} not found` });

    users.splice(users.indexOf(deletedUser), 1);
    return res.json(deletedUser);
  };
}
