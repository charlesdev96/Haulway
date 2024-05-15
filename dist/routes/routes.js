"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoute_1 = require("./authRoute");
const profileRoutes_1 = require("./profileRoutes");
const filesRoutes_1 = require("./filesRoutes");
const postRoutes_1 = require("./postRoutes");
const commentRoute_1 = require("./commentRoute");
const replyCommentRoute_1 = require("./replyCommentRoute");
class RouterConfig {
    constructor() {
        this.router = (0, express_1.Router)();
        this.configureRoutes();
    }
    configureRoutes() {
        const baseUrl = "/api/v1";
        //authentication route
        this.router.use(`${baseUrl}/auth`, new authRoute_1.authRoute().getAuthRouter());
        //profile routes
        this.router.use(`${baseUrl}/profile`, new profileRoutes_1.profileRoute().getProfileRoutes());
        //files upload
        this.router.use(`${baseUrl}`, new filesRoutes_1.FilesUploadRouter().getFiles());
        //post routes
        this.router.use(`${baseUrl}/post`, new postRoutes_1.PostRouter().getPostRouter());
        //comment route
        this.router.use(`${baseUrl}/comment`, new commentRoute_1.commentRouter().getCommentRouter());
        //reply comment route
        this.router.use(`${baseUrl}/reply`, new replyCommentRoute_1.ReplyCommentRouter().getReplyCommentRouter());
    }
    getRouter() {
        return this.router;
    }
}
exports.default = RouterConfig;
