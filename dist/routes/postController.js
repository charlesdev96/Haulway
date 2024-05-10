"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRouter = void 0;
const express_1 = require("express");
const postController_1 = require("../controller/postController");
const middleware_1 = require("../middleware");
const schema_1 = require("../schema");
class PostRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.postController = new postController_1.PostController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        //create post
        this.router.post("/create-post", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.createPostSchema), this.postController.createPost.bind(this.postController));
    }
    getPostRouter() {
        return this.router;
    }
}
exports.PostRouter = PostRouter;
