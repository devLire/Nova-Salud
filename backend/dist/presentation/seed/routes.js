"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedRoutes = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
class SeedRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const seedController = new controller_1.SeedController();
        router.post('/', seedController.runSeed);
        router.get('/', seedController.runSeed);
        return router;
    }
}
exports.SeedRoutes = SeedRoutes;
