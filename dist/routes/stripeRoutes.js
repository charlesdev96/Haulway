"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeRouter = void 0;
const express_1 = require("express");
const stripeController_1 = require("../controller/stripeController");
const middleware_1 = require("../middleware");
class StripeRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.stripeController = new stripeController_1.StripeController();
        this.initializeRoute();
    }
    initializeRoute() {
        this.router.post("/stripe-onboarding", middleware_1.authorizeUser, this.stripeController.stripeOnBoarding.bind(this.stripeController));
        //delete stripe account
        this.router.delete("/delete-account/:stripeId", this.stripeController.deleteStripeAccount.bind(this.stripeController));
    }
    getAllStripeRoute() {
        return this.router;
    }
}
exports.StripeRouter = StripeRouter;
