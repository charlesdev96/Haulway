"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeRouter = void 0;
const express_1 = require("express");
const stripeController_1 = require("../controller/stripeController");
const middleware_1 = require("../middleware");
const schema_1 = require("../schema");
class StripeRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.stripeController = new stripeController_1.StripeController();
        this.initializeRoute();
    }
    initializeRoute() {
        this.router.post("/stripe-onboarding", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.onboardUserSchema), this.stripeController.stripeOnBoarding.bind(this.stripeController));
        this.router.get("/check-status/:stripeId", this.stripeController.checkOnboardingStatus.bind(this.stripeController));
        //delete stripe account
        this.router.delete("/delete-account/:stripeId", this.stripeController.deleteStripeAccount.bind(this.stripeController));
    }
    getAllStripeRoute() {
        return this.router;
    }
}
exports.StripeRouter = StripeRouter;
