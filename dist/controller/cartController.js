"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const services_1 = require("../services");
const http_status_codes_1 = require("http-status-codes");
const utils_1 = require("../utils");
class CartController {
    addProductToCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const body = req.body;
                const { productId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                //find logged in user
                const user = yield (0, services_1.findUserById)(userId);
                //check if user exist
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found" });
                }
                //find product
                const product = yield (0, services_1.findVendorProductById)(productId);
                if (!product) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found" });
                }
                //check if user already has a cart model already
                const userCartExist = yield (0, services_1.checkIfUserCartExist)(userId);
                //if user has cart, then check if product is already in cart and if not add it
                if (userCartExist) {
                    //check if product is already in cart
                    const productAlreadyInCart = yield (0, services_1.checkIfProductInUserCart)(productId, userCartExist._id);
                    if (productAlreadyInCart) {
                        return res
                            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                            .json({ message: "Product already in your cart" });
                    }
                    else {
                        //else add product to cart
                        body.cart = userCartExist._id;
                        body.product = product._id;
                        body.store = product.store;
                        const item = yield (0, services_1.addItemToCart)(body);
                        if (item && item._id) {
                            (_b = userCartExist.cartItems) === null || _b === void 0 ? void 0 : _b.push(item._id);
                            yield userCartExist.save();
                        }
                        return res.status(http_status_codes_1.StatusCodes.OK).json({
                            success: true,
                            message: "Item successfully added to cart",
                            data: item,
                        });
                    }
                }
                else {
                    //create cart model and add item to cart
                    const cart = yield (0, services_1.createCartFirstTime)({ user: userId });
                    //add item to cart
                    body.cart = cart._id;
                    body.product = product._id;
                    body.store = product.store;
                    const item = yield (0, services_1.addItemToCart)(body);
                    if (item && item._id) {
                        (_c = cart.cartItems) === null || _c === void 0 ? void 0 : _c.push(item._id);
                        yield cart.save();
                    }
                    user.carts = cart._id;
                    yield user.save();
                    return res.status(http_status_codes_1.StatusCodes.OK).json({
                        success: true,
                        message: "Item successfully added to cart",
                        data: item,
                    });
                }
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `Unable to add product to cart due to: ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while adding product to cart",
                    });
                }
            }
        });
    }
    updateCartItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { productId } = req.params;
                const { quantity } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                //find logged in user
                const user = yield (0, services_1.findUserById)(userId);
                //check if user exist
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found" });
                }
                //find user's cart
                const cart = yield (0, services_1.checkIfUserCartExist)(userId);
                if (!cart) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User cart not found" });
                }
                //find the cart item to be updated
                const cartItem = yield (0, services_1.checkIfProductInUserCart)(productId, cart._id);
                if (!cartItem) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "cart item not found" });
                }
                //proceed to update cart item
                if (quantity)
                    cartItem.quantity = quantity;
                yield cartItem.save();
                res
                    .status(http_status_codes_1.StatusCodes.OK)
                    .json({ success: true, message: "Cart item successfullly updated" });
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `Unable to update cart due to: ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while updating to cart",
                    });
                }
            }
        });
    }
    removeCartItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { productId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                //find logged in user
                const user = yield (0, services_1.findUserById)(userId);
                //check if user exist
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found" });
                }
                //find user's cart
                const cart = yield (0, services_1.checkIfUserCartExist)(userId);
                if (!cart) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User cart not found" });
                }
                //find the cart item to be updated
                const cartItem = yield (0, services_1.checkIfProductInUserCart)(productId, cart._id);
                if (!cartItem) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "cart item not found" });
                }
                //proceed to remove item from users cart
                cart.cartItems = (_b = cart.cartItems) === null || _b === void 0 ? void 0 : _b.filter((item) => item.toString() !== cartItem._id.toString());
                yield cart.save();
                //delete cart item from db
                yield cartItem.deleteOne();
                res
                    .status(http_status_codes_1.StatusCodes.OK)
                    .json({ success: true, message: "Cart item successfully removed" });
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `Unable to remove item from cart due to: ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while removing item from cart",
                    });
                }
            }
        });
    }
    getUserCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                //find logged in user
                const user = yield (0, services_1.findUserById)(userId);
                //check if user exist
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found" });
                }
                const cart = yield (0, services_1.getUserCartItems)(userId);
                if (!cart) {
                    return res.status(http_status_codes_1.StatusCodes.OK).json({
                        success: true,
                        message: "Your cart is currently empty.",
                        data: [],
                    });
                }
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: "Your cart has been successfully retrieved.",
                    data: cart,
                });
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `Unable to get user cart: ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while getting user cart",
                    });
                }
            }
        });
    }
}
exports.CartController = CartController;
