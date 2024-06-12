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
exports.VendorProductController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
const http_status_codes_1 = require("http-status-codes");
class VendorProductController {
    createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const body = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                //find logged in user
                const user = yield (0, services_1.findUserById)(userId);
                //check if user exist
                if (!user || !user.role) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found" });
                }
                //check user role
                if (user.role !== "vendor") {
                    return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                        message: "You are forbidden to access this route. Only vendors are allowed.",
                    });
                }
                //find user store
                const store = yield (0, services_1.findStoreByUserId)(userId.toString());
                if (!store) {
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ message: "No store found for the user" });
                }
                //proceed to create product
                body.vendor = userId;
                body.store = store._id;
                const discountedPrice = (1 - (body.productPrice.discount || 0)) * body.productPrice.basePrice;
                body.productPrice.discountPrice = Number(discountedPrice.toFixed(2));
                body.productPrice.price = body.productPrice.discountPrice;
                const product = yield (0, services_1.createNewVendorProduct)(body);
                if (!product || !product._id) {
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ message: "Unable to create product" });
                }
                //update user that created the product
                (_b = user.products) === null || _b === void 0 ? void 0 : _b.push(product._id);
                user.numOfProducts = (_c = user.products) === null || _c === void 0 ? void 0 : _c.length;
                yield user.save();
                //find user store and push product to it
                (_d = store.products) === null || _d === void 0 ? void 0 : _d.push(product._id);
                yield store.save();
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    success: true,
                    message: "Congratulations, you have successfully created a product",
                    data: product,
                });
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `Unable to create product due to: ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while creating the product",
                    });
                }
            }
        });
    }
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
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
                if (!user || !user.role) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found" });
                }
                //check user role
                if (user.role !== "vendor") {
                    return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                        message: "You are forbidden to access this route. Only vendors are allowed.",
                    });
                }
                //find product
                const product = yield (0, services_1.findVendorProductById)(productId);
                if (!product) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "Product not found" });
                }
                //check if product belong to user
                if (((_b = product.vendor) === null || _b === void 0 ? void 0 : _b.toString()) !== userId.toString()) {
                    return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                        message: "Oops! It looks like you can't edit this product. Only the author can make changes.",
                    });
                }
                // proceed to update product
                if (body.productPrice && body.productPrice.basePrice) {
                    const discountedPrice = (1 - (body.productPrice.discount || 0)) * body.productPrice.basePrice;
                    body.productPrice.discountPrice = Number(discountedPrice.toFixed(2));
                    body.productPrice.price = body.productPrice.discountPrice;
                    yield (0, services_1.updateVendorProduct)(productId, body);
                    res.status(http_status_codes_1.StatusCodes.OK).json({
                        success: true,
                        message: "Product successfully updated",
                    });
                }
                else {
                    yield (0, services_1.updateVendorProduct)(productId, body);
                    res.status(http_status_codes_1.StatusCodes.OK).json({
                        success: true,
                        message: "Product successfully updated",
                    });
                }
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
                        return res
                            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                            .json({ message: "Wrong Id format" });
                    }
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `Unable to create product due to: ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while creating the product",
                    });
                }
            }
        });
    }
    getAllVendorProducts(req, res) {
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
                if (!user || !user.role) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found" });
                }
                //check user role
                if (user.role !== "vendor") {
                    return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                        message: "You are forbidden to access this route. Only vendors are allowed.",
                    });
                }
                const products = yield (0, services_1.getVendorProductsByUserId)(userId);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: "List of all products",
                    data: products,
                });
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `Unable to create vendor post due to: ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while creating vendor post",
                    });
                }
            }
        });
    }
    buyProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
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
                if (!user || !user.role) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found" });
                }
                //find product
                const product = yield (0, services_1.findVendorProductById)(productId);
                if (!product || !((_b = product.productPrice) === null || _b === void 0 ? void 0 : _b.price) || !((_c = product.genInfo) === null || _c === void 0 ? void 0 : _c.name)) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "Product not found" });
                }
                const paymentUrl = yield (0, utils_1.paymentInitializationFunction)((_d = product.productPrice) === null || _d === void 0 ? void 0 : _d.price, 1, (_e = product.genInfo) === null || _e === void 0 ? void 0 : _e.name);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: "Please use the link for your payment",
                    data: paymentUrl,
                });
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
                        return res
                            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                            .json({ message: "Wrong Id format" });
                    }
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `Unable to create product payment link due to: ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while creating the product payment link",
                    });
                }
            }
        });
    }
}
exports.VendorProductController = VendorProductController;
