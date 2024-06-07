"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfluencerRouter = void 0;
const express_1 = require("express");
const influencerProductController_1 = require("../controller/influencerProductController");
const middleware_1 = require("../middleware");
const schema_1 = require("../schema");
class InfluencerRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.influencerProductCon = new influencerProductController_1.InfluencerProductController();
        this.initializeRoute();
    }
    initializeRoute() {
        //create influencer product
        this.router.post("/create-product", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.influencerProductSchema), this.influencerProductCon.createProduct.bind(this.influencerProductCon));
        //update influencer product
        this.router.patch("/update-product/:productId", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.updateInfluencerProductSchema), this.influencerProductCon.updateProduct.bind(this.influencerProductCon));
    }
    getInfluencerRoute() {
        return this.router;
    }
}
exports.InfluencerRouter = InfluencerRouter;
