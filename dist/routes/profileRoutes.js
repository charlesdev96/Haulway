"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRoute = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const profileController_1 = require("../controller/profileController");
const schema_1 = require("../schema");
class profileRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.profileController = new profileController_1.profiles();
        this.initializeRoutes();
    }
    initializeRoutes() {
        //user profile
        this.router.get("/user-profile", middleware_1.authorizeUser, this.profileController.userProfile.bind(this.profileController));
        //update profile
        this.router.patch("/update-profile", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.updateProfileSchema), this.profileController.updateProfile.bind(this.profileController));
    }
    getProfileRoutes() {
        return this.router;
    }
}
exports.profileRoute = profileRoute;
