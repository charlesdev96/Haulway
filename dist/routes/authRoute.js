"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = require("express");
const authController_1 = require("../controller/authController");
const schema_1 = require("../schema");
const middleware_1 = require("../middleware");
class authRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.userAuthentication = new authController_1.authController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        //register user
        this.router.post("/register", (0, middleware_1.validateInputs)(schema_1.registerUserSchema), this.userAuthentication.register.bind(this.userAuthentication));
    }
    getAuthRouter() {
        return this.router;
    }
}
exports.authRoute = authRoute;
