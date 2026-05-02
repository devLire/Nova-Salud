import { Router } from 'express';
import { UserController } from './controller';

export class UserRoutes {
  static get routes(): Router {
    const router = Router();
    const userController = new UserController();

    router.get('/', userController.getUsers);
    router.get('/:id', userController.getUserByID);

    router.post('/', userController.createUser);
    router.put('/:id', userController.updateUser);
    router.delete('/:id', userController.deleteUser);

    return router;
  }
}
