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
exports.singlePost = exports.timeLinePost = exports.findPostByUser = exports.findPostById = exports.createPosts = void 0;
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
const timeLinePost = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield model_1.PostModel.find({})
        .select("+_id +content +desc +views +numOfLikes +numOfComments +comments +products +addMusic +postedBy +createdAt +updatedAt")
        .populate({
        path: "postedBy",
        select: "+_id +fullName +profilePic +createdAt +updatedAt +numOfFollowings +numOfFollowers +followers",
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
            createdAt: post.createdAt || null,
            updatedAt: post.updatedAt || null,
            postedBy: post.postedBy
                ? {
                    _id: ((_a = post.postedBy) === null || _a === void 0 ? void 0 : _a._id) || null,
                    fullName: post.postedBy.fullName || null,
                    profilePic: post.postedBy.profilePic,
                    numOfFollowings: post.postedBy.numOfFollowings,
                    numOfFollowers: post.postedBy.numOfFollowers,
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
                    createdAt: comment.createdAt || null,
                    updatedAt: comment.updatedAt || null,
                    commentedBy: comment.commentedBy
                        ? {
                            _id: ((_a = comment.commentedBy) === null || _a === void 0 ? void 0 : _a._id) || null,
                            fullName: comment.commentedBy.fullName || null,
                            profilePic: comment.commentedBy.profilePic,
                        }
                        : null,
                    numOfReplies: comment.numOfReplies,
                    replies: comment.replies.map((reply) => {
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
                                    profilePic: reply.replier.profilePic,
                                }
                                : null,
                        });
                    }),
                });
            }),
        };
    });
    return postsData;
});
exports.timeLinePost = timeLinePost;
const singlePost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield model_1.PostModel.findOne({ _id: postId })
        .select("+_id +content +desc +views +numOfLikes +numOfComments +comments +postedBy +createdAt +updatedAt")
        .populate({
        path: "postedBy",
        select: "+_id +fullName +profilePic +createdAt +updatedAt +numOfFollowings +numOfFollowers",
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
    return post;
    // if (!post) {
    // 	return null;
    // }
    // const postData: PartialPost{}= {
    // 	_id: post._id || null,
    // 	content: post.content || null,
    // 	desc: post.desc || null,
    // 	createdAt:post.createdAt || null
    // 	updatedAt: post.updatedAt || null,
    // 	postedBy: {
    // 		_id: post.postedBy?._id || null,
    // 		fullName: post.postedBy?.fullName || null,
    // 		profilePic: post.postedBy?.profilePic || null,
    // 		numOfFollowings: post.postedBy?.numOfFollowings || 0,
    // 		numOfFollowers: post.postedBy?.numOfFollowers || 0,
    // 	},
    // 	views: post.views || 0,
    // 	numOfLikes: post.numOfLikes || 0,
    // 	numOfComments: post.numOfComments || 0,
    // 	comments: (post.comments || []).map((comment: any) => ({
    // 		_id: comment._id || null,
    // 		comment: comment.comment || null,
    // 		post: comment.post || null,
    // 		createdAt: comment.createdAt || null,
    // 		updatedAt: comment.updatedAt || null,
    // 		commentedBy: {
    // 			_id: comment.commentedBy?._id || null,
    // 			fullName: comment.commentedBy?.fullName || null,
    // 			profilePic: comment.commentedBy?.profilePic || null,
    // 		},
    // 		numOfReplies: comment.numOfReplies || 0,
    // 		replies: (comment.replies || []).map((reply: any) => ({
    // 			_id: reply._id || null,
    // 			reply: reply.reply || null,
    // 			comment: reply.comment || null,
    // 			createdAt: reply.createdAt || null,
    // 			updatedAt: reply.updatedAt || null,
    // 			replier: {
    // 				_id: reply.replier?._id || null,
    // 				fullName: reply.replier?.fullName || null,
    // 				profilePic: reply.replier?.profilePic || null,
    // 			},
    // 		})),
    // 	})),
    // };
    // return postData;
});
exports.singlePost = singlePost;
