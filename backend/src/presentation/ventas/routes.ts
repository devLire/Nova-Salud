import { Router } from 'express';
import { VentasController } from './controller';

export class VentasRoutes {
  static get routes(): Router {
    const router = Router();
    const ventasController = new VentasController();

    router.get('/', ventasController.getVentas);
    router.get('/:id', ventasController.getVentaByID);
    router.post('/', ventasController.createVenta);
    router.put('/:id', ventasController.updateVenta);

    return router;
  }
}
