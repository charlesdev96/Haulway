"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserActivityRouter = void 0;
const express_1 = require("express");
const userActivityController_1 = require("../controller/userActivityController");
const middleware_1 = require("../middleware");
const schema_1 = require("../schema");
class UserActivityRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.userActivityController = new userActivityController_1.UserActivitiesController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        //follow and unfollower user
        this.router.patch("/follow-user/:targetUserId", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.followerUserSchema), this.userActivityController.followUser.bind(this.userActivityController));
        //like and unlike a post
        this.router.patch("/like-post/:postId", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.likePostSchema), this.userActivityController.likePost.bind(this.userActivityController));
    }
    getUserActivityRouter() {
        return this.router;
    }
}
exports.UserActivityRouter = UserActivityRouter;
