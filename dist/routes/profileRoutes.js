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
        //upgrade account
        this.router.post("/upgrade-account", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.upgradeAccountSchema), this.profileController.upgradeAccount.bind(this.profileController));
        //user profile
        this.router.get("/user-profile", middleware_1.authorizeUser, this.profileController.userProfile.bind(this.profileController));
        //update profile
        this.router.patch("/update-profile", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.updateProfileSchema), this.profileController.updateProfile.bind(this.profileController));
        //update store
        this.router.patch("/update-store", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.updateStoreSchema), this.profileController.updateStore.bind(this.profileController));
        //delete account
        this.router.delete("/delete-account", (0, middleware_1.validateInputs)(schema_1.deleteAccountSchema), this.profileController.deleteAccount.bind(this.profileController));
    }
    getProfileRoutes() {
        return this.router;
    }
}
exports.profileRoute = profileRoute;
