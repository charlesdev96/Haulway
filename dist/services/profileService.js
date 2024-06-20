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
exports.getUserProfile = exports.getVendorProfile = void 0;
const model_1 = require("../model");
const getVendorProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.UserModel.findById(userId)
        .select("_id profilePic fullName userName role numOfFollowers numOfFollowings numOfPosts posts savedPosts products requests contracts")
        .populate({
        path: "posts",
        select: "_id content caption postedBy thumbNail views numOfLikes numOfComments comments options tagPeople products",
        populate: [
            {
                path: "postedBy",
                select: "_id fullName profilePic userName numOfFollowings numOfFollowers",
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
                select: "_id genInfo productPrice productReview numOfProReviews reviews",
                populate: {
                    path: "reviews",
                    select: "_id comment rating reviewer",
                    populate: {
                        path: "reviewer",
                        select: "_id fullName profilePic userName",
                    },
                },
            },
        ],
    })
        .populate({
        path: "products",
        select: "-__v -reviewers",
        populate: [
            {
                path: "reviews",
                select: "_id comment rating reviewer",
                populate: {
                    path: "reviewer",
                    select: "_id fullName profilePic userName",
                },
            },
            {
                path: "buyers",
                select: "_id fullName profilePic userName",
            },
        ],
    })
        .populate({
        path: "savedPosts",
        select: "_id content caption postedBy thumbNail views numOfLikes numOfComments comments options tagPeople products",
        populate: [
            {
                path: "postedBy",
                select: "_id fullName profilePic userName numOfFollowings numOfFollowers",
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
                select: "_id genInfo productPrice productReview numOfProReviews reviews",
                populate: {
                    path: "reviews",
                    select: "_id comment rating reviewer",
                    populate: {
                        path: "reviewer",
                        select: "_id fullName profilePic userName",
                    },
                },
            },
        ],
    });
});
exports.getVendorProfile = getVendorProfile;
const getUserProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.UserModel.findById(userId)
        .select("_id profilePic fullName userName role numOfFollowers numOfFollowings numOfPosts posts savedPosts")
        .populate({
        path: "posts",
        select: "_id content caption postedBy thumbNail views numOfLikes numOfComments comments options tagPeople",
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
        ],
    })
        .populate({
        path: "savedPosts",
        select: "_id content caption postedBy thumbNail views numOfLikes numOfComments comments options tagPeople",
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
        ],
    });
});
exports.getUserProfile = getUserProfile;
