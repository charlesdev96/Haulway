"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoute_1 = require("./authRoute");
class RouterConfig {
    constructor() {
        this.router = (0, express_1.Router)();
        this.configureRoutes();
    }
    configureRoutes() {
        const baseUrl = "/api/v1";
        this.router.use(`${baseUrl}/auth`, new authRoute_1.authRoute().getAuthRouter());
    }
    getRouter() {
        return this.router;
    }
}
exports.default = RouterConfig;
