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
exports.InfluencerProductController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
const http_status_codes_1 = require("http-status-codes");
class InfluencerProductController {
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
                if (user.role === "influencer") {
                    return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                        message: "You are forbidden to access this route. Only influencers are allowed.",
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
                body.influencer = userId;
                const discountedPrice = (1 - (body.productPrice.discount || 0)) * body.productPrice.basePrice;
                body.productPrice.discountPrice = Number(discountedPrice.toFixed(2));
                body.productPrice.price = body.productPrice.discountPrice;
                const product = yield (0, services_1.createNewInfluencerProduct)(body);
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
}
exports.InfluencerProductController = InfluencerProductController;
