"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const userController_1 = require("../controller/userController");
class UserRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.userController = new userController_1.UserController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        //get all users
        this.router.get("/get-all-users", middleware_1.authorizeUser, this.userController.getAllUsers.bind(this.userController));
    }
    getAllUserRouter() {
        return this.router;
    }
}
exports.UserRouter = UserRouter;
