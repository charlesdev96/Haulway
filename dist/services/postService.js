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
exports.timeLinePost = exports.findPostByUser = exports.findPostById = exports.createPosts = void 0;
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
const timeLinePost = () => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield model_1.PostModel.find({})
        .select("+_id +content +desc +views +numOfLikes +numOfComments +comments +postedBy +createdAt +updatedAt")
        .populate({
        path: "postedBy",
        select: "+_id +fullName +profilePic +createdAt +updatedAt",
    })
        .populate({
        path: "comments",
        select: "+_id +comment +numOfReplies +replies +createdAt +updatedAt +commentedBy",
        populate: [
            {
                path: "replies",
                select: "+_id +reply +replier +createdAt +updatedAt",
                populate: {
                    path: "replier",
                    select: "+_id +fullName +profilePic",
                },
            },
            {
                path: "commentedBy",
                select: "+_id +fullName +profilePic",
            },
        ],
    })
        .sort({ updatedAt: -1 });
    const postsData = posts.map((post) => {
        var _a;
        return ({
            _id: post._id,
            content: post.content || null,
            desc: post.desc || null,
            postedBy: post.postedBy
                ? {
                    _id: ((_a = post.postedBy) === null || _a === void 0 ? void 0 : _a._id) || null,
                    fullName: post.postedBy.fullName || null,
                    profilePic: post.postedBy.profilePic,
                    createdAt: post.postedBy.createdAt || null,
                    updatedAt: post.postedBy.updatedAt || null,
                }
                : null,
            views: post.views,
            numOfLikes: post.numOfLikes,
            numOfComments: post.numOfComments,
            comments: post.comments.map((comment) => {
                var _a;
                return ({
                    _id: comment._id || null,
                    comment: comment.comment || null,
                    post: comment.post || null,
                    commentedBy: comment.commentedBy
                        ? {
                            _id: ((_a = comment.commentedBy) === null || _a === void 0 ? void 0 : _a._id) || null,
                            fullName: comment.commentedBy.fullName || null,
                            profilePic: comment.commentedBy.profilePic,
                            createdAt: comment.commentedBy.createdAt || null,
                            updatedAt: comment.commentedBy.updatedAt || null,
                        }
                        : null,
                    numOfReplies: comment.numOfReplies,
                    replies: comment.replies.map((reply) => {
                        var _a;
                        return ({
                            _id: reply._id || null,
                            reply: reply.reply || null,
                            comment: reply.comment || null,
                            replier: reply.replier
                                ? {
                                    _id: ((_a = reply.replier) === null || _a === void 0 ? void 0 : _a._id) || null,
                                    fullName: reply.replier.fullName || null,
                                    profilePic: reply.replier.profilePic,
                                }
                                : null,
                            createdAt: reply.createdAt || null,
                            updatedAt: reply.updatedAt || null,
                        });
                    }),
                    createdAt: comment.createdAt || null,
                    updatedAt: comment.updatedAt || null,
                });
            }),
            createdAt: post.createdAt || null,
            updatedAt: post.updatedAt || null,
        });
    });
    return postsData;
});
exports.timeLinePost = timeLinePost;
