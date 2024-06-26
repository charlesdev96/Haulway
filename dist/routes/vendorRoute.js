"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRouter = void 0;
const express_1 = require("express");
const vendorProductController_1 = require("../controller/vendorProductController");
const profileController_1 = require("../controller/profileController");
const middleware_1 = require("../middleware");
const schema_1 = require("../schema");
class VendorRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.vendorProductController = new vendorProductController_1.VendorProductController();
        this.profile = new profileController_1.profiles();
        this.initializeRoute();
    }
    initializeRoute() {
        this.router.post("/create-product", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.vendorProductSchema), this.vendorProductController.createProduct.bind(this.vendorProductController));
        //get all products
        this.router.get("/get-vendor-products", middleware_1.authorizeUser, this.vendorProductController.getAllVendorProducts.bind(this.vendorProductController));
        //vendor store
        this.router.get("/vendor-store", middleware_1.authorizeUser, this.profile.vendorStore.bind(this.profile));
        //get vendors with products
        this.router.get("/vendors-with-products", middleware_1.authorizeUser, this.vendorProductController.getAllVendorsWithProducts.bind(this.vendorProductController));
        //get vendor product
        this.router.get("/vendor-product/:vendorId", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.getVendorProductSchema), this.vendorProductController.getSingleVendorProduct.bind(this.vendorProductController));
        //update product
        this.router.patch("/update-product/:productId", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.updateVendorProductSchema), this.vendorProductController.updateProduct.bind(this.vendorProductController));
        //delete product
        this.router.delete("/delete-product/:productId", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.deleteVendorProductSchema), this.vendorProductController.deleteProduct.bind(this.vendorProductController));
    }
    getVendorRouter() {
        return this.router;
    }
}
exports.VendorRouter = VendorRouter;
