"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoute_1 = require("./authRoute");
const profileRoutes_1 = require("./profileRoutes");
class RouterConfig {
    constructor() {
        this.router = (0, express_1.Router)();
        this.configureRoutes();
    }
    configureRoutes() {
        const baseUrl = "/api/v1";
        //authentication route
        this.router.use(`${baseUrl}/auth`, new authRoute_1.authRoute().getAuthRouter());
        //profile routes
        this.router.use(`${baseUrl}/profile`, new profileRoutes_1.profileRoute().getProfileRoutes());
    }
    getRouter() {
        return this.router;
    }
}
exports.default = RouterConfig;
