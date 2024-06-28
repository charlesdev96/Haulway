"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WiseRouter = void 0;
const express_1 = require("express");
const wiseController_1 = require("../controller/wiseController");
const middleware_1 = require("../middleware");
const schema_1 = require("../schema");
class WiseRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.wiseController = new wiseController_1.WiseController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        //create a wise profile
        this.router.post("/create-profile", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.createProfileSchema), this.wiseController.createUserProfile.bind(this.wiseController));
    }
    getWiseRouter() {
        return this.router;
    }
}
exports.WiseRouter = WiseRouter;
