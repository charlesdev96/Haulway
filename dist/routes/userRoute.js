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
        //get all vendors
        this.router.get("/get-all-vendors", middleware_1.authorizeUser, this.userController.getAllVendors.bind(this.userController));
        //get all influencers
        this.router.get("/get-all-influencers", middleware_1.authorizeUser, this.userController.getAllInfluencers.bind(this.userController));
        //search for users
        this.router.get("/search-users", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.searchUserSchema), this.userController.searchUsers.bind(this.userController));
        //search for vendors
        this.router.get("/search-vendor", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.searchUserSchema), this.userController.searchForVendors.bind(this.userController));
        //search for influencers
        this.router.get("/search-influencer", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.searchUserSchema), this.userController.searchForInfluencers.bind(this.userController));
        //get single user route
        this.router.get("/get-single-user/:id", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.getSingleUserSchema), this.userController.getSingleUser.bind(this.userController));
    }
    getAllUserRouter() {
        return this.router;
    }
}
exports.UserRouter = UserRouter;
