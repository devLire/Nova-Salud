import { Router } from 'express';
import { ProveedorController } from './controller';

export class ProveedorRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new ProveedorController();

    router.get('/', controller.getProveedores);
    router.get('/:id', controller.getProveedorByID);
    router.post('/', controller.createProveedor);
    router.put('/:id', controller.updateProveedor);
    router.delete('/:id', controller.deleteProveedor);

    return router;
  }
}