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
exports.singlePost = exports.timeLinePost = exports.deleteReplyByPost = exports.deleteCommentByPost = exports.findPostByUser = exports.findPostById = exports.createPosts = void 0;
const model_1 = require("../model");
const createPosts = (input) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.PostModel.create(input);
});
exports.createPosts = createPosts;
const findPostById = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.PostModel.findOne({ _id: postId });
});
exports.findPostById = findPostById;
const findPostByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.PostModel.find({ postedBy: userId }).sort({ updatedAt: -1 });
});
exports.findPostByUser = findPostByUser;
const deleteCommentByPost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.CommentModel.deleteMany({ post: postId });
});
exports.deleteCommentByPost = deleteCommentByPost;
const deleteReplyByPost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.ReplyModel.deleteMany({ post: postId });
});
exports.deleteReplyByPost = deleteReplyByPost;
const timeLinePost = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield model_1.PostModel.find({})
        .select("_id content caption views numOfLikes numOfComments products createdAt updatedAt numOfPeopleTag addCategory numOfShares")
        .populate({
        path: "postedBy",
        select: "_id fullName profilePic userName numOfFollowings numOfFollowers followers",
    })
        .sort({ updatedAt: -1 });
    const postsData = (posts || []).map((post) => {
        let status = "follow";
        // Check if userId is the owner of the post
        if (post.postedBy._id.toString() === userId.toString()) {
            status = "owner";
        }
        // Check if userId is in the followers array
        if (post.postedBy.followers.includes(userId.toString())) {
            status = "following";
        }
        // Remove the followers field from postedBy
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _a = post.postedBy._doc, { followers } = _a, postedBy = __rest(_a, ["followers"]);
        return Object.assign(Object.assign({ status: status }, post._doc), { postedBy });
    });
    return postsData;
});
exports.timeLinePost = timeLinePost;
const singlePost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    // Increment the views by 1
    yield model_1.PostModel.updateOne({ _id: postId }, { $inc: { views: 1 } });
    return yield model_1.PostModel.findOne({ _id: postId })
        .select("_id content caption postedBy numOfShares views numOfLikes numOfComments options products numOfProducts numOfPeopleTag addCategory")
        .populate({
        path: "postedBy",
        select: "_id fullName profilePic userName numOfFollowings numOfFollowers followers",
    })
        .populate({
        path: "products",
        select: "_id genInfo productPrice productReview store reviews",
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
    })
        .sort({ updatedAt: -1 });
});
exports.singlePost = singlePost;
