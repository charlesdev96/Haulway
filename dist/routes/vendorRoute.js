"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRouter = void 0;
const express_1 = require("express");
const vendorProductController_1 = require("../controller/vendorProductController");
const middleware_1 = require("../middleware");
const schema_1 = require("../schema");
class VendorRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.vendorProductController = new vendorProductController_1.VendorProductController();
        this.initializeRoute();
    }
    initializeRoute() {
        this.router.post("/create-product", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.vendorProductSchema), this.vendorProductController.createProduct.bind(this.vendorProductController));
        //update product
        this.router.patch("/update-product/:productId", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.updateVendorProductSchema), this.vendorProductController.updateProduct.bind(this.vendorProductController));
    }
    getVendorRouter() {
        return this.router;
    }
}
exports.VendorRouter = VendorRouter;
