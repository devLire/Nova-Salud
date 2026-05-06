"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
class AuthRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const authController = new controller_1.AuthController();
        router.post('/login', authController.loginUser);
        router.get('/check-status', auth_middleware_1.AuthMiddleware.validateJWT, authController.checkAuthStatusUser);
        return router;
    }
}
exports.AuthRoutes = AuthRoutes;
