"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const userController_1 = require("../controller/userController");
const schema_1 = require("../schema");
class UserRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.userController = new userController_1.UserController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        //get all users
        this.router.get("/get-all-users", middleware_1.authorizeUser, this.userController.getAllUsers.bind(this.userController));
        //get single user route
        this.router.get("/get-single-user/:id", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.getSingleUserSchema), this.userController.getSingleUser.bind(this.userController));
    }
    getAllUserRouter() {
        return this.router;
    }
}
exports.UserRouter = UserRouter;
