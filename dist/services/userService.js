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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginData = exports.searchUsersByRole = exports.searchForUsers = exports.userData = exports.validatePassword = exports.userNameExist = exports.singleUser = exports.getAllUsersByRole = exports.getAllUser = exports.findUserById = exports.existingUser = exports.userProfile = exports.registerUser = void 0;
const model_1 = require("../model");
const lodash_1 = require("lodash");
const bcryptjs_1 = require("bcryptjs");
const registerUser = (input) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield model_1.UserModel.create(input);
        return (0, lodash_1.omit)(user, "password");
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.registerUser = registerUser;
const userProfile = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.UserModel.findOne({ email: email }).select("_id profilePic fullName userName email role verified numOfPosts deviceType numOfFollowers numOfFollowings createdAt updatedAt profileViews");
});
exports.userProfile = userProfile;
const existingUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.UserModel.findOne({ email: email });
});
exports.existingUser = existingUser;
const findUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.UserModel.findOne({ _id: userId });
});
exports.findUserById = findUserById;
const getAllUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    //exclude the logged in user
    const users = yield model_1.UserModel.find({ _id: { $ne: userId } })
        .select("_id userName profilePic fullName role followers")
        .sort({ createdAt: -1 });
    const data = (users || []).map((user) => {
        let status = "follow";
        // Check if userId is in the followers array
        if (user.followers.includes(userId.toString())) {
            status = "following";
        }
        // Remove the followers field from postedBy
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _a = user._doc, { followers } = _a, userDetails = __rest(_a, ["followers"]);
        return Object.assign({ status: status }, userDetails);
    });
    return data;
});
exports.getAllUser = getAllUser;
const getAllUsersByRole = (role, userId) => __awaiter(void 0, void 0, void 0, function* () {
    //exclude the user from the list returned
    if (role === "vendor") {
        const topAccount = yield model_1.UserModel.find({
            role: role,
            _id: { $ne: userId },
        })
            .select("_id profilePic role userName fullName store")
            .populate({
            path: "store",
            select: "_id storeLogo storeName",
        })
            .sort({ numOfFollowers: -1 });
        const recentAccount = yield model_1.UserModel.find({
            role: role,
            _id: { $ne: userId },
        })
            .select("_id profilePic role userName fullName store")
            .populate({
            path: "store",
            select: "_id storeLogo storeName",
        })
            .sort({ createdAt: -1 });
        return { topAccount, recentAccount };
    }
    else {
        const topAccount = yield model_1.UserModel.find({
            role: role,
            _id: { $ne: userId },
        })
            .select("_id profilePic role userName fullName influencerStore")
            .populate({
            path: "influencerStore",
            select: "_id storeLogo storeName",
        })
            .sort({ numOfFollowers: -1 });
        const recentAccount = yield model_1.UserModel.find({
            role: role,
            _id: { $ne: userId },
        })
            .select("_id profilePic role userName fullName influencerStore")
            .populate({
            path: "influencerStore",
            select: "_id storeLogo storeName",
        })
            .sort({ createdAt: -1 });
        return { topAccount, recentAccount };
    }
});
exports.getAllUsersByRole = getAllUsersByRole;
const singleUser = (searchedUserId) => __awaiter(void 0, void 0, void 0, function* () {
    // Increment the profileViews by 1
    yield model_1.UserModel.updateOne({ _id: searchedUserId }, { $inc: { profileViews: 1 } });
    return model_1.UserModel.findOne({ _id: searchedUserId })
        .select("_id profilePic fullName userName numOfFollowers numOfFollowings numOfPosts followers posts products")
        .populate({
        path: "posts",
        select: "_id content caption views thumbNail numOfLikes numOfComments postedBy products createdAt updatedAt numOfPeopleTag addCategory numOfShares",
        populate: [
            {
                path: "postedBy",
                select: "_id fullName profilePic userName numOfFollowings numOfFollowers followers",
            },
            {
                path: "products",
                select: "_id genInfo productPrice productReview store",
                populate: {
                    path: "store",
                    select: "_id storeName storeLogo",
                },
            },
        ],
    })
        .populate({
        path: "products",
        select: "-__v -shippingAndDelivery -inventory -vendor -buyers -reviewers",
        populate: [
            {
                path: "store",
                select: "_id storeName storeLogo",
            },
            {
                path: "reviews",
                select: "_id comment rating reviewer",
                populate: {
                    path: "reviewer",
                    select: "_id fullName profilePic userName",
                },
            },
        ],
    });
});
exports.singleUser = singleUser;
const userNameExist = (userName) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.UserModel.findOne({ userName: userName }).select("-password -verificationCode -passwordResetCode -otp");
});
exports.userNameExist = userNameExist;
const validatePassword = (userPassword, canditatePassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, bcryptjs_1.compare)(userPassword, canditatePassword);
});
exports.validatePassword = validatePassword;
const userData = (role, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (role === "vendor") {
        return yield model_1.UserModel.findById(userId)
            .select("_id profilePic userName role numOfPosts fullName profileViews numOfPosts numOfFollowers numOfFollowings posts store products")
            .populate({
            path: "posts",
            select: "_id content caption products",
            populate: {
                path: "products",
                select: "_id genInfo productPrice productReview numOfProReviews",
            },
        })
            .populate({
            path: "store",
            select: "_id storeName storeLogo currency products",
            populate: {
                path: "products",
                select: "_id genInfo productPrice productReview numOfProReviews",
            },
        })
            .populate({
            path: "products",
            select: "_id genInfo productPrice productReview numOfProReviews averageRating",
        });
    }
    else if (role === "influencer") {
        return yield model_1.UserModel.findById(userId)
            .select("_id profilePic userName role numOfPosts fullName profileViews numOfPosts numOfFollowers numOfFollowings store posts influencerPro")
            .populate({
            path: "posts",
            select: "_id content caption products",
            populate: {
                path: "products",
                select: "_id genInfo productPrice productReview numOfProReviews averageRating",
            },
        })
            .populate({
            path: "store",
            select: "_id storeName storeLogo currency videos influencerProducts",
            populate: {
                path: "influencerProducts",
                select: "_id genInfo productPrice productReview numOfProReviews averageRating",
            },
        })
            .populate({
            path: "influencerPro",
            select: "_id genInfo productPrice productReview averageRating numOfProReviews",
        });
    }
    else {
        return yield model_1.UserModel.findById(userId)
            .select("_id profilePic userName role numOfPosts fullName profileViews numOfPosts numOfFollowers numOfFollowings posts")
            .populate({
            path: "posts",
            select: "_id content caption",
        });
    }
});
exports.userData = userData;
const searchForUsers = (search, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const searchRegex = new RegExp(search, "i"); // 'i' for case-insensitive search
    return yield model_1.UserModel.find({
        $and: [
            {
                $or: [
                    { userName: { $regex: searchRegex } },
                    { fullName: { $regex: searchRegex } },
                ],
            },
            { _id: { $ne: userId } }, // Exclude the logged-in user
        ],
    }).select("_id profilePic fullName role userName");
});
exports.searchForUsers = searchForUsers;
const searchUsersByRole = (search, role, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const searchRegex = new RegExp(search, "i"); // 'i' for case-insensitive search
    return yield model_1.UserModel.find({
        $and: [
            { role: role }, // Match the role
            {
                $or: [
                    { userName: { $regex: searchRegex } },
                    { fullName: { $regex: searchRegex } },
                ],
            },
            { _id: { $ne: userId } }, // Exclude the logged-in user
        ],
    }).select("_id profilePic fullName userName role");
});
exports.searchUsersByRole = searchUsersByRole;
const loginData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.UserModel.findOne({ _id: userId }).select("_id profilePic userName role numOfPosts fullName profileViews numOfPosts numOfFollowers numOfFollowings");
});
exports.loginData = loginData;
