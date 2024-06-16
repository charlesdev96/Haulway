"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewProductRouter = void 0;
const express_1 = require("express");
const reviewProductController_1 = require("../controller/reviewProductController");
const middleware_1 = require("../middleware");
const schema_1 = require("../schema");
class ReviewProductRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.productReviewController = new reviewProductController_1.ProductReviewController();
        this.initializeRouter();
    }
    initializeRouter() {
        this.router.post("/review-product/:productId", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.reviewProductSchema), this.productReviewController.productReview.bind(this.productReviewController));
    }
    getReviewProductRouter() {
        return this.router;
    }
}
exports.ReviewProductRouter = ReviewProductRouter;
