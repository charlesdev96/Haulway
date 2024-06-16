"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = void 0;
const express_1 = require("express");
const commentController_1 = require("../controller/commentController");
const schema_1 = require("../schema");
const middleware_1 = require("../middleware");
class commentRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.commentController = new commentController_1.CommentController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        //comment on a post
        this.router.post("/create-comment/:postId", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.createCommentSchema), this.commentController.createComment.bind(this.commentController));
        //get all comments in a post
        this.router.get("/post-comment/:postId", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.getPostReviewSchema), this.commentController.getPostComments.bind(this.commentController));
        //update comment
        this.router.patch("/edit-comment/:commentId", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.updateCommentSchema), this.commentController.editComment.bind(this.commentController));
        //delete comment
        this.router.delete("/delete-comment/:commentId", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.deletecommentSchema), this.commentController.deleteComment.bind(this.commentController));
    }
    getCommentRouter() {
        return this.router;
    }
}
exports.commentRouter = commentRouter;
