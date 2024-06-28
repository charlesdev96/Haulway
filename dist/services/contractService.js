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
exports.getSingleRequestByRole = exports.getSingleContractByRole = exports.chnageVendorContractStatus = exports.findContractors = exports.findContractById = exports.createContract = void 0;
const model_1 = require("../model");
const createContract = (input) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.ContractModel.create(input);
});
exports.createContract = createContract;
const findContractById = (contractId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.ContractModel.findById(contractId);
});
exports.findContractById = findContractById;
const findContractors = (contractorId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.UserModel.findOne({ _id: contractorId });
});
exports.findContractors = findContractors;
const chnageVendorContractStatus = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    return yield model_1.ContractModel.find({
        vendor: userId,
        completionDate: { $lte: now },
        status: { $ne: "completed" },
    });
});
exports.chnageVendorContractStatus = chnageVendorContractStatus;
const getSingleContractByRole = (role, contractId) => __awaiter(void 0, void 0, void 0, function* () {
    if (role === "vendor") {
        return yield model_1.ContractModel.findById(contractId)
            .select("-__v -vendor")
            .populate({
            path: "influencer",
            select: "_id fullName profilePic userName numOfFollowers role influencerStore",
            populate: {
                path: "influencerStore",
                select: "_id storeName storeLogo",
            },
        })
            .populate({
            path: "products",
            select: "_id genInfo productPrice productReview numOfProReviews reviews",
            populate: {
                path: "reviews",
                select: "_id comment rating reviewer",
                populate: {
                    path: "reviewer",
                    select: "_id fullName profilePic userName",
                },
            },
        });
    }
    else {
        return yield model_1.ContractModel.findById(contractId)
            .select("-__v -influencer")
            .populate({
            path: "vendor",
            select: "_id fullName profilePic userName numOfFollowers role store",
            populate: {
                path: "store",
                select: "_id storeName storeLogo",
            },
        })
            .populate({
            path: "products",
            select: "_id genInfo productPrice productReview numOfProReviews reviews",
            populate: {
                path: "reviews",
                select: "_id comment rating reviewer",
                populate: {
                    path: "reviewer",
                    select: "_id fullName profilePic userName",
                },
            },
        });
    }
});
exports.getSingleContractByRole = getSingleContractByRole;
const getSingleRequestByRole = (role, contractId) => __awaiter(void 0, void 0, void 0, function* () {
    if (role === "vendor") {
        return yield model_1.ContractModel.findById(contractId)
            .select("-__v -vendor")
            .populate({
            path: "influencer",
            select: "_id fullName profilePic userName numOfFollowers role influencerStore",
            populate: {
                path: "influencerStore",
                select: "_id storeName storeLogo",
            },
        })
            .populate({
            path: "products",
            select: "_id genInfo productPrice productReview numOfProReviews reviews",
            populate: {
                path: "reviews",
                select: "_id comment rating reviewer",
                populate: {
                    path: "reviewer",
                    select: "_id fullName profilePic userName",
                },
            },
        });
    }
    else {
        return yield model_1.ContractModel.findById(contractId)
            .select("-__v -influencer")
            .populate({
            path: "vendor",
            select: "_id fullName profilePic userName numOfFollowers role store",
            populate: {
                path: "store",
                select: "_id storeName storeLogo",
            },
        })
            .populate({
            path: "products",
            select: "_id genInfo productPrice productReview numOfProReviews reviews",
            populate: {
                path: "reviews",
                select: "_id comment rating reviewer",
                populate: {
                    path: "reviewer",
                    select: "_id fullName profilePic userName",
                },
            },
        });
    }
});
exports.getSingleRequestByRole = getSingleRequestByRole;
