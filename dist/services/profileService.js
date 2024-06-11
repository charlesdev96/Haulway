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
exports.getVendorProfile = void 0;
const model_1 = require("../model");
const getVendorProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.UserModel.findById(userId)
        .select("_id profilePic fullName userName role numOfFollowers numOfFollowings numOfPosts posts savedPosts products requests contracts")
        .populate({
        path: "posts",
        select: "_id content caption postedBy views numOfLikes numOfComments comments options tagPeople products",
        populate: [
            {
                path: "postedBy",
                select: "_id fullName profilePic userName numOfFollowings numOfFollowers followers",
            },
            {
                path: "tagPeople",
                select: "_id fullName userName profilePic",
            },
            {
                path: "comments",
                select: "_id comment numOfReplies replies createdAt updatedAt commentedBy",
                populate: [
                    {
                        path: "replies",
                        select: "_id reply replier createdAt updatedAt",
                        populate: {
                            path: "replier",
                            select: "_id fullName userName profilePic",
                        },
                    },
                    {
                        path: "commentedBy",
                        select: "_id fullName userName profilePic",
                    },
                ],
            },
            {
                path: "products",
            },
        ],
    })
        .populate({
        path: "products",
    });
});
exports.getVendorProfile = getVendorProfile;
