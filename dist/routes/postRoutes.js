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
        //get all posts
        this.router.get("/display-posts", middleware_1.authorizeUser, this.postController.getAllPost.bind(this.postController));
        //create post
        this.router.post("/create-user-post", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.createUserPostSchema), this.postController.createUserPost.bind(this.postController));
        //create vendor influencer
        this.router.post("/create-vendor-influencer-post", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.createVendorPostSchema), this.postController.createVendorPost.bind(this.postController));
        //get single post
        this.router.get("/get-post/:postId", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.getSinglePostSchema), this.postController.getSinglePost.bind(this.postController));
        //update post
        this.router.patch("/update-post/:postId", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.updatePostSchema), this.postController.updatePost.bind(this.postController));
        //delete post
        this.router.delete("/delete-post/:postId", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.deletePostSchema), this.postController.deletePost.bind(this.postController));
    }
    getPostRouter() {
        return this.router;
    }
}
exports.PostRouter = PostRouter;
