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
exports.getUserCartItems = exports.findCartItemById = exports.checkIfUserCartExist = exports.checkIfProductInUserCart = exports.addItemToCart = exports.createCartFirstTime = void 0;
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
const getUserCartItems = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the cart items
    const cart = yield model_1.CartModel.findOne({ user: userId })
        .select("cartItems")
        .populate({
        path: "cartItems",
        select: "store product quantity",
        populate: [
            {
                path: "store",
                select: "_id storeName storeLogo",
            },
            {
                path: "product",
                select: "genInfo productPrice productReview",
            },
        ],
    })
        .lean();
    if (!cart)
        return [];
    // Type assertion to help TypeScript understand the structure
    const cartItems = cart.cartItems;
    const SHIPPING_FEE = 25;
    // Group items by store
    const storeGroups = {};
    cartItems.forEach((item) => {
        const storeId = item.store._id;
        if (!storeGroups[storeId]) {
            storeGroups[storeId] = {
                store: item.store,
                items: [],
                subtotal: 0,
                shipping: SHIPPING_FEE,
                total: 0,
            };
        }
        storeGroups[storeId].items.push({
            product: item.product,
            quantity: item.quantity,
        });
        storeGroups[storeId].subtotal +=
            item.product.productPrice.price * item.quantity;
    });
    // Calculate totals for each store and the grand total
    let grandTotal = 0;
    Object.keys(storeGroups).forEach((storeId) => {
        const storeGroup = storeGroups[storeId];
        storeGroup.total = storeGroup.subtotal + storeGroup.shipping;
        grandTotal += storeGroup.total;
    });
    grandTotal = Number(parseFloat(grandTotal.toFixed(2)));
    // Extract the store group objects into an array with only the items
    const storeGroupsArray = Object.values(storeGroups).map((storeGroup) => ({
        store: storeGroup.store,
        items: storeGroup.items.map((item) => ({
            product: item.product,
            quantity: item.quantity,
        })),
        subtotal: Number(storeGroup.subtotal.toFixed(2)),
        shipping: Number(storeGroup.shipping.toFixed(2)),
        total: storeGroup.total,
    }));
    return {
        storeGroups: storeGroupsArray,
        grandTotal,
    };
});
exports.getUserCartItems = getUserCartItems;
