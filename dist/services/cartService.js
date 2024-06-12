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
exports.findCartItemById = exports.checkIfUserCartExist = exports.checkIfProductInUserCart = exports.addItemToCart = exports.createCartFirstTime = void 0;
const model_1 = require("../model");
const createCartFirstTime = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.CartModel.create(inputs);
});
exports.createCartFirstTime = createCartFirstTime;
const addItemToCart = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.CartItemModel.create(inputs);
});
exports.addItemToCart = addItemToCart;
const checkIfProductInUserCart = (productId, cartId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.CartItemModel.findOne({ product: productId, cart: cartId });
});
exports.checkIfProductInUserCart = checkIfProductInUserCart;
const checkIfUserCartExist = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.CartModel.findOne({ user: userId });
});
exports.checkIfUserCartExist = checkIfUserCartExist;
const findCartItemById = (cartItemId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.CartItemModel.findById(cartItemId);
});
exports.findCartItemById = findCartItemById;
