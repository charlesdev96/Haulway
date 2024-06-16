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
exports.ProductReviewController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
const http_status_codes_1 = require("http-status-codes");
class ProductReviewController {
    productReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            try {
                const body = req.body;
                const { productId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                const user = yield (0, services_1.findUserById)(userId);
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found" });
                }
                //check if user has bought the product
                const product = yield (0, services_1.findVendorProductById)(productId);
                if (!product) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "product not found" });
                }
                //check if user has already bought the course
                const alreadyBoughtProduct = (_b = product.buyers) === null || _b === void 0 ? void 0 : _b.includes(userId.toString());
                if (!alreadyBoughtProduct &&
                    ((_c = product.vendor) === null || _c === void 0 ? void 0 : _c.toString()) !== userId.toString()) {
                    return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                        message: "Sorry, you can't review this product because you haven't purchased it yet.",
                    });
                }
                //check if user has reviewed before
                const alreadyReviewedProduct = (_d = product.reviewers) === null || _d === void 0 ? void 0 : _d.includes(userId.toString());
                //product owners can also comment on a post
                if (alreadyReviewedProduct) {
                    return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                        message: "Sorry, you can't review this product because you have already reviewed it before.",
                    });
                }
                //proceed to review product
                if (!body.comment && !body.rating) {
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ message: "Please provide comment or rating" });
                }
                body.product = productId;
                body.reviewer = userId;
                const review = yield (0, services_1.createProductReview)(body);
                //calculate product rating
                const currentRating = product.averageRating || 0;
                const currentNumReviews = product.numOfProReviews || 0;
                const newNumOfReviews = currentNumReviews + 1;
                const rating = body.rating || 0;
                const totalRating = currentRating * currentNumReviews;
                const newAverageRating = (totalRating + rating) / newNumOfReviews;
                product.averageRating = newAverageRating;
                //save the new product details
                yield ((_e = product.reviews) === null || _e === void 0 ? void 0 : _e.push(review._id));
                product.numOfProReviews = (_f = product.reviews) === null || _f === void 0 ? void 0 : _f.length;
                yield ((_g = product.reviewers) === null || _g === void 0 ? void 0 : _g.push(userId));
                yield product.save();
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    success: true,
                    message: "Congratulations, you have successfully reviewed this product",
                    data: review,
                });
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    if (error.name === "CastError") {
                        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                            success: false,
                            message: "Invalid review ID format.",
                        });
                    }
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `Unable to create a review on product due to: ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while reviewing product",
                    });
                }
            }
        });
    }
}
exports.ProductReviewController = ProductReviewController;
