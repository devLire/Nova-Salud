import { Router } from 'express';
import { IngresosController } from './controller';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { RoleMiddleware } from '../../middlewares/role.middleware';

export class IngresosRoutes {
  static get routes(): Router {
    const router = Router();
    const ingresosController = new IngresosController();

    // Middlewares globales
    router.use(AuthMiddleware.validateJWT);

    // INVENTARIO puede registrar un ingreso
    router.post('/', RoleMiddleware.requireRoles(['INVENTARIO']), ingresosController.createIngreso);

    // El resto solo ADMIN
    router.use(RoleMiddleware.requireAdmin);

    router.get('/', ingresosController.getIngresos);
    router.get('/:id', ingresosController.getIngresoByID);

    return router;
  }
}
