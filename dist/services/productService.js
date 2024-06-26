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
exports.getVendorsWithProducts = exports.getVendorProduct = exports.deleteVendorProductReview = exports.deleteVendorProduct = exports.getVendorProductsByUserId = exports.updateInfluencerProduct = exports.updateVendorProduct = exports.createNewInfluencerProduct = exports.createNewVendorProduct = exports.findInfluencerProductById = exports.findVendorProductById = void 0;
const model_1 = require("../model");
const findVendorProductById = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.VendorProductModel.findById(productId);
});
exports.findVendorProductById = findVendorProductById;
const findInfluencerProductById = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.InfluencerProductModel.findById(productId);
});
exports.findInfluencerProductById = findInfluencerProductById;
const createNewVendorProduct = (input) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.VendorProductModel.create(input);
});
exports.createNewVendorProduct = createNewVendorProduct;
const createNewInfluencerProduct = (input) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.InfluencerProductModel.create(input);
});
exports.createNewInfluencerProduct = createNewInfluencerProduct;
const updateVendorProduct = (productId, updates) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.VendorProductModel.findOneAndUpdate({ _id: productId }, updates, { new: true, runValidators: true });
});
exports.updateVendorProduct = updateVendorProduct;
const updateInfluencerProduct = (productId, updates) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.InfluencerProductModel.updateOne({ _id: productId }, { $set: updates });
});
exports.updateInfluencerProduct = updateInfluencerProduct;
const getVendorProductsByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const stores = yield model_1.StoreModel.find({ owner: userId })
        .select("products")
        .populate({
        path: "products",
        select: "_id genInfo.name productPrice.price productReview",
    });
    const products = stores.flatMap((store) => {
        var _a;
        return ((_a = store.products) === null || _a === void 0 ? void 0 : _a.map((product) => ({
            _id: product._id,
            name: product.genInfo.name,
            price: product.productPrice.price,
            products: product.productReview.products,
        }))) || [];
    });
    return products;
});
exports.getVendorProductsByUserId = getVendorProductsByUserId;
const deleteVendorProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.VendorProductModel.deleteOne({ _id: productId });
});
exports.deleteVendorProduct = deleteVendorProduct;
const deleteVendorProductReview = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.ProductReviewModel.deleteMany({ product: productId });
});
exports.deleteVendorProductReview = deleteVendorProductReview;
const getVendorProduct = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.VendorProductModel.find({ vendor: userId }).select("_id genInfo productPrice productReview createdAt updatedAt");
});
exports.getVendorProduct = getVendorProduct;
const getVendorsWithProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.UserModel.find({
        role: "vendor",
        numOfProducts: { $gt: 0 },
    })
        .select("_id profilePic userName fullName store")
        .populate({
        path: "store",
        select: "_id storeLogo storeName numOfProducts",
    });
});
exports.getVendorsWithProducts = getVendorsWithProducts;
