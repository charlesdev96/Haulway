"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplyCommentRouter = void 0;
const express_1 = require("express");
const replyCommentController_1 = require("../controller/replyCommentController");
const middleware_1 = require("../middleware");
const schema_1 = require("../schema");
class ReplyCommentRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.replyCommentController = new replyCommentController_1.ReplyCommentController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        //reply a comment
        this.router.post("/create-reply/:postId/:commentId", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.createreplySchema), this.replyCommentController.CreateReply.bind(this.replyCommentController));
        //edit reply
        this.router.patch("/edit-reply/:replyId", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.editReplySchema), this.replyCommentController.editReply.bind(this.replyCommentController));
        //reply a comment
        this.router.delete("/delete-reply/:replyId", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.deleteReplySchema), this.replyCommentController.deleteReply.bind(this.replyCommentController));
    }
    getReplyCommentRouter() {
        return this.router;
    }
}
exports.ReplyCommentRouter = ReplyCommentRouter;
