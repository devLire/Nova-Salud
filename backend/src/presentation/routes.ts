import { Router } from 'express';
import { UserRoutes } from './users/routes';
import { AuthRoutes } from './auth/routes';
import { ProveedorRoutes } from './proveedor/routes';
import { CategoriasRoutes } from './categorias/routes';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use('/api/users', UserRoutes.routes);
    router.use('/api/auth', AuthRoutes.routes);
    router.use('/api/proveedores', ProveedorRoutes.routes);
    router.use('/api/categorias', CategoriasRoutes.routes);

    return router;
  }
}