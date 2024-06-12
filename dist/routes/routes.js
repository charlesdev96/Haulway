"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoute_1 = require("./authRoute");
const profileRoutes_1 = require("./profileRoutes");
const filesRoutes_1 = require("./filesRoutes");
const postRoutes_1 = require("./postRoutes");
const commentRoute_1 = require("./commentRoute");
const replyCommentRoute_1 = require("./replyCommentRoute");
const userActivityRoute_1 = require("./userActivityRoute");
const userRoute_1 = require("./userRoute");
const vendorRoute_1 = require("./vendorRoute");
const influencerRoute_1 = require("./influencerRoute");
const stripeRoutes_1 = require("./stripeRoutes");
const cartRoute_1 = require("./cartRoute");
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
        //user activities router
        this.router.use(`${baseUrl}/activity`, new userActivityRoute_1.UserActivityRouter().getUserActivityRouter());
        //user router
        this.router.use(`${baseUrl}/user`, new userRoute_1.UserRouter().getAllUserRouter());
        //vendor router
        this.router.use(`${baseUrl}/vendor`, new vendorRoute_1.VendorRouter().getVendorRouter());
        //influencer route
        this.router.use(`${baseUrl}/influencer`, new influencerRoute_1.InfluencerRouter().getInfluencerRoute());
        //stripe router
        this.router.use(`${baseUrl}/stripe`, new stripeRoutes_1.StripeRouter().getAllStripeRoute());
        //cart router
        this.router.use(`${baseUrl}/cart`, new cartRoute_1.CartRouter().getCartRouter());
    }
    getRouter() {
        return this.router;
    }
}
exports.default = RouterConfig;
