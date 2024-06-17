"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRouter = void 0;
const express_1 = require("express");
const cartController_1 = require("../controller/cartController");
const middleware_1 = require("../middleware");
const schema_1 = require("../schema");
class CartRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.cartController = new cartController_1.CartController();
        this.initializeRoute();
    }
    initializeRoute() {
        //get user cart
        this.router.get("/user-cart", middleware_1.authorizeUser, this.cartController.getUserCart.bind(this.cartController));
        //add item to cart
        this.router.post("/add-item/:productId", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.addItemToCartSchema), this.cartController.addProductToCart.bind(this.cartController));
        //update cart item
        this.router.patch("/update-item/:productId", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.updateCartSchema), this.cartController.updateCartItems.bind(this.cartController));
        //remove cart item
        this.router.delete("/remove-item/:productId", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.removeItemSchema), this.cartController.removeCartItem.bind(this.cartController));
    }
    getCartRouter() {
        return this.router;
    }
}
exports.CartRouter = CartRouter;
