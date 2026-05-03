import { Router } from 'express';
import { CategoriasController } from './controller';

export class CategoriasRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new CategoriasController();

    router.get('/', controller.getCategorias);
    router.get('/:id', controller.getCategoriaByID);
    router.post('/', controller.createCategoria);
    router.put('/:id', controller.updateCategoria);
    router.delete('/:id', controller.deleteCategoria);

    return router;
  }
}