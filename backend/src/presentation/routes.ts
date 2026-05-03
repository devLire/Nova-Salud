import { Router } from 'express';
import { UserRoutes } from './users/routes';
import { AuthRoutes } from './auth/routes';
import { ProveedoresRoutes } from './proveedores/routes';
import { CategoriasRoutes } from './categorias/routes';
import { ProductosRoutes } from './productos/routes';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use('/api/users', UserRoutes.routes);
    router.use('/api/auth', AuthRoutes.routes);
    router.use('/api/proveedores', ProveedoresRoutes.routes);
    router.use('/api/categorias', CategoriasRoutes.routes);
    router.use('/api/productos', ProductosRoutes.routes);

    return router;
  }
}
