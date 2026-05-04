import { Router } from 'express';
import { IngresosController } from './controller';

export class IngresosRoutes {
  static get routes(): Router {
    const router = Router();
    const ingresosController = new IngresosController();

    router.get('/', ingresosController.getIngresos);
    router.get('/:id', ingresosController.getIngresoByID);
    router.post('/', ingresosController.createIngreso);

    return router;
  }
}

