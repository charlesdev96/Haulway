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
exports.singlePost = exports.timeLinePost = exports.deleteReplyByPost = exports.deleteCommentByPost = exports.findPostByUser = exports.findPostById = exports.createPosts = void 0;
const model_1 = require("../model");
const types_1 = require("../types");
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
        .select("+_id +content +desc +views +numOfLikes +numOfComments +comments +products +addMusic +postedBy +createdAt +updatedAt +tagPeople +numOfPeopleTag +addLocation +addMusic +addCategory +numOfShares")
        .populate({
        path: "postedBy",
        select: "+_id +fullName +profilePic +createdAt +updatedAt +numOfFollowings +numOfFollowers +followers",
    })
        .populate({
        path: "tagPeople",
        select: "+_id +fullName +profilePic",
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
    const postsData = (posts || []).map((post) => {
        var _a;
        let status = "follow";
        // Check if userId is the owner of the post
        if (post.postedBy._id.toString() === userId.toString()) {
            status = "owner";
        }
        // Check if userId is in the followers array
        if (post.postedBy.followers.includes(userId.toString())) {
            status = "following";
        }
        return {
            _id: post._id,
            status: status,
            content: post.content || null,
            desc: post.desc || null,
            views: post.views,
            numOfShares: post.numOfShares,
            numOfLikes: post.numOfLikes,
            numOfComments: post.numOfComments,
            numOfPeopleTag: post.numOfPeopleTag,
            addLocation: post.addLocation || types_1.location || {},
            addMusic: post.addMusic || "" || null,
            addCategory: post.addCategory || [] || null,
            createdAt: post.createdAt || null,
            updatedAt: post.updatedAt || null,
            postedBy: post.postedBy
                ? {
                    _id: ((_a = post.postedBy) === null || _a === void 0 ? void 0 : _a._id) || null,
                    fullName: post.postedBy.fullName || null,
                    profilePic: post.postedBy.profilePic || "",
                    numOfFollowings: post.postedBy.numOfFollowings,
                    numOfFollowers: post.postedBy.numOfFollowers,
                }
                : {},
            tagPeople: (post.tagPeople || []).map((people) => ({
                _id: people._id || null,
                fullName: people.fullName || null,
                profilePic: people.profilePic || "",
            })),
            products: post.products || [],
            comments: (post.comments || []).map((comment) => {
                var _a;
                return ({
                    _id: comment._id || null,
                    comment: comment.comment || null,
                    post: comment.post || null,
                    createdAt: comment.createdAt || null,
                    updatedAt: comment.updatedAt || null,
                    commentedBy: comment.commentedBy
                        ? {
                            _id: ((_a = comment.commentedBy) === null || _a === void 0 ? void 0 : _a._id) || null,
                            fullName: comment.commentedBy.fullName || "",
                            profilePic: comment.commentedBy.profilePic,
                        }
                        : {},
                    numOfReplies: comment.numOfReplies,
                    replies: (comment.replies || []).map((reply) => {
                        var _a;
                        return ({
                            _id: reply._id || null,
                            reply: reply.reply || null,
                            comment: reply.comment || null,
                            createdAt: reply.createdAt || null,
                            updatedAt: reply.updatedAt || null,
                            replier: reply.replier
                                ? {
                                    _id: ((_a = reply.replier) === null || _a === void 0 ? void 0 : _a._id) || null,
                                    fullName: reply.replier.fullName || null,
                                    profilePic: reply.replier.profilePic || "",
                                }
                                : {},
                        });
                    }),
                });
            }),
        };
    });
    return postsData;
});
exports.timeLinePost = timeLinePost;
const singlePost = (postId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Increment the views by 1
    yield model_1.PostModel.updateOne({ _id: postId }, { $inc: { views: 1 } });
    const post = yield model_1.PostModel.findOne({ _id: postId })
        .select("+_id +content +desc +views +numOfLikes +numOfComments +comments +products +addMusic +postedBy +createdAt +updatedAt +tagPeople +numOfPeopleTag +addLocation +addMusic +addCategory +numOfShares")
        .populate({
        path: "postedBy",
        select: "+_id +fullName +profilePic +createdAt +updatedAt +numOfFollowings +numOfFollowers +followers",
    })
        .populate({
        path: "tagPeople",
        select: "+_id +fullName +profilePic",
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
    const posts = [post];
    const postsData = (posts || []).map((post) => {
        var _a;
        let status = "follow";
        // Check if userId is the owner of the post
        if (post.postedBy._id.toString() === userId.toString()) {
            status = "owner";
        }
        // Check if userId is in the followers array
        if (post.postedBy.followers.includes(userId.toString())) {
            status = "following";
        }
        return {
            _id: post._id,
            status: status,
            content: post.content || null,
            desc: post.desc || null,
            views: post.views,
            numOfShares: post.numOfShares,
            numOfLikes: post.numOfLikes,
            numOfComments: post.numOfComments,
            numOfPeopleTag: post.numOfPeopleTag,
            addLocation: post.addLocation || types_1.location || {},
            addMusic: post.addMusic || "" || null,
            addCategory: post.addCategory || [] || null,
            createdAt: post.createdAt || null,
            updatedAt: post.updatedAt || null,
            postedBy: post.postedBy
                ? {
                    _id: ((_a = post.postedBy) === null || _a === void 0 ? void 0 : _a._id) || null,
                    fullName: post.postedBy.fullName || null,
                    profilePic: post.postedBy.profilePic || "",
                    numOfFollowings: post.postedBy.numOfFollowings,
                    numOfFollowers: post.postedBy.numOfFollowers,
                }
                : {},
            tagPeople: (post.tagPeople || []).map((people) => ({
                _id: people._id || null,
                fullName: people.fullName || null,
                profilePic: people.profilePic || "",
            })),
            products: post.products || [],
            comments: (post.comments || []).map((comment) => {
                var _a;
                return ({
                    _id: comment._id || null,
                    comment: comment.comment || null,
                    post: comment.post || null,
                    createdAt: comment.createdAt || null,
                    updatedAt: comment.updatedAt || null,
                    commentedBy: comment.commentedBy
                        ? {
                            _id: ((_a = comment.commentedBy) === null || _a === void 0 ? void 0 : _a._id) || null,
                            fullName: comment.commentedBy.fullName || "",
                            profilePic: comment.commentedBy.profilePic,
                        }
                        : {},
                    numOfReplies: comment.numOfReplies,
                    replies: (comment.replies || []).map((reply) => {
                        var _a;
                        return ({
                            _id: reply._id || null,
                            reply: reply.reply || null,
                            comment: reply.comment || null,
                            createdAt: reply.createdAt || null,
                            updatedAt: reply.updatedAt || null,
                            replier: reply.replier
                                ? {
                                    _id: ((_a = reply.replier) === null || _a === void 0 ? void 0 : _a._id) || null,
                                    fullName: reply.replier.fullName || null,
                                    profilePic: reply.replier.profilePic || "",
                                }
                                : {},
                        });
                    }),
                });
            }),
        };
    });
    return postsData;
});
exports.singlePost = singlePost;
