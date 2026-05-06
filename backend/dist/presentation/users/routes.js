"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
class UserRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const userController = new controller_1.UserController();
        // Middlewares globales
        router.use(auth_middleware_1.AuthMiddleware.validateJWT);
        router.use(role_middleware_1.RoleMiddleware.requireAdmin);
        router.get('/', userController.getUsers);
        router.get('/:id', userController.getUserByID);
        router.post('/', userController.createUser);
        router.put('/:id', userController.updateUser);
        router.delete('/:id', userController.deleteUser);
        return router;
    }
}
exports.UserRoutes = UserRoutes;
