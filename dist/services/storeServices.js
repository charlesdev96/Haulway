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
exports.getInfluencerStore = exports.getVendorStore = exports.findInfluencerStoreById = exports.findInfluencerStoreByUserId = exports.findInfluencerStoreByName = exports.createInfluencerStore = exports.findStoreById = exports.findStoreByUserId = exports.findStoreByName = exports.createStore = void 0;
const model_1 = require("../model");
const createStore = (input) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.StoreModel.create(input);
});
exports.createStore = createStore;
const findStoreByName = (storeName) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.StoreModel.findOne({ storeName: storeName });
});
exports.findStoreByName = findStoreByName;
const findStoreByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.StoreModel.findOne({ owner: userId });
});
exports.findStoreByUserId = findStoreByUserId;
const findStoreById = (storeId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.StoreModel.findById(storeId);
});
exports.findStoreById = findStoreById;
const createInfluencerStore = (input) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.InfluencerStoreModel.create(input);
});
exports.createInfluencerStore = createInfluencerStore;
const findInfluencerStoreByName = (storeName) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.InfluencerStoreModel.findOne({ storeName: storeName });
});
exports.findInfluencerStoreByName = findInfluencerStoreByName;
const findInfluencerStoreByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.InfluencerStoreModel.findOne({ owner: userId });
});
exports.findInfluencerStoreByUserId = findInfluencerStoreByUserId;
const findInfluencerStoreById = (storeId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.InfluencerStoreModel.findById(storeId);
});
exports.findInfluencerStoreById = findInfluencerStoreById;
const getVendorStore = (storeId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.StoreModel.findById(storeId)
        .select("-__v")
        .populate({
        path: "owner",
        select: "_id profilePic fullName userName",
    })
        .populate({
        path: "products",
        select: "-reviewers -buyers -vendor -store",
        populate: {
            path: "reviews",
            select: "_id comment rating reviewer",
            populate: {
                path: "reviewer",
                select: "_id profilePic fullName userName",
            },
        },
    });
});
exports.getVendorStore = getVendorStore;
const getInfluencerStore = (storeId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.InfluencerStoreModel.findById(storeId)
        .select("-__v")
        .populate({
        path: "owner",
        select: "_id profilePic fullName userName",
    })
        .populate({
        path: "influencerProducts",
        select: "-reviewers -buyers -influencer -store",
    });
});
exports.getInfluencerStore = getInfluencerStore;
