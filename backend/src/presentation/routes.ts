import { Router } from 'express';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.get('/api/test', (req, res) => {
      res.json([
        {
          id: 1,
        },
      ]);
    });

    return router;
  }
}
