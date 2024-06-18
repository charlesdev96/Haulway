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
exports.PostController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
const http_status_codes_1 = require("http-status-codes");
const model_1 = require("../model");
class PostController {
    createUserPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                const user = yield (0, services_1.findUserById)(userId);
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found" });
                }
                const body = req.body;
                body.postedBy = userId;
                body.numOfPeopleTag = (_b = body.tagPeople) === null || _b === void 0 ? void 0 : _b.length;
                const post = yield (0, services_1.createPosts)(body);
                //push post._id
                yield ((_c = user.posts) === null || _c === void 0 ? void 0 : _c.push(post._id));
                user.numOfPosts = (_d = user.posts) === null || _d === void 0 ? void 0 : _d.length;
                yield user.save();
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    success: true,
                    message: "Post created successfully!",
                    data: post,
                });
            }
            catch (error) {
                utils_1.log.info(error.message);
                res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ success: false, message: "Unable to create user post" });
            }
        });
    }
    createVendorPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const body = req.body;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                const user = yield (0, services_1.findUserById)(userId);
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found" });
                }
                body.postedBy = userId;
                body.numOfPeopleTag = (_b = body.tagPeople) === null || _b === void 0 ? void 0 : _b.length;
                body.numOfProducts = (_c = body.products) === null || _c === void 0 ? void 0 : _c.length;
                const post = yield (0, services_1.createPosts)(body);
                //push post._id
                yield ((_d = user.posts) === null || _d === void 0 ? void 0 : _d.push(post._id));
                user.numOfPosts = (_e = user.posts) === null || _e === void 0 ? void 0 : _e.length;
                yield user.save();
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    success: true,
                    message: "Post created successfully!",
                    data: post,
                });
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `Unable to create vendor post due to: ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while creating vendor post",
                    });
                }
            }
        });
    }
    getAllPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                const user = yield (0, services_1.findUserById)(userId);
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found" });
                }
                const posts = yield (0, services_1.timeLinePost)(userId);
                res
                    .status(http_status_codes_1.StatusCodes.OK)
                    .json({ success: true, message: "List of all posts", data: posts });
            }
            catch (error) {
                utils_1.log.info(error.message);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: `Unable to display all posts: error: ${error.message}`,
                });
            }
        });
    }
    getAllTrendingPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                const user = yield (0, services_1.findUserById)(userId);
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found" });
                }
                const posts = yield (0, services_1.getTrendingPosts)(userId);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: "List of all trending posts",
                    data: posts,
                });
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `Unable to get treanding post due to: ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while getting trending post",
                    });
                }
            }
        });
    }
    savePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const { postId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                const user = yield (0, services_1.findUserById)(userId);
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found" });
                }
                const post = yield (0, services_1.findPostById)(postId);
                if (!post) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "Post not found" });
                }
                //check if user have already saved the post
                const alreadySavedPost = (_b = user.savedPosts) === null || _b === void 0 ? void 0 : _b.includes(postId.toString());
                if (alreadySavedPost) {
                    //if user have already saved the post, remove the saved post
                    user.savedPosts = (_c = user.savedPosts) === null || _c === void 0 ? void 0 : _c.filter((postSaved) => postSaved.toString() !== postId.toString());
                    yield user.save();
                    return res.status(http_status_codes_1.StatusCodes.OK).json({
                        success: true,
                        message: "Successfully removed from your saved post collection.",
                    });
                }
                else {
                    //procced to save post
                    yield ((_d = user.savedPosts) === null || _d === void 0 ? void 0 : _d.push(postId));
                    yield user.save();
                    res.status(http_status_codes_1.StatusCodes.OK).json({
                        success: true,
                        message: "Post successfully saved to your profile",
                    });
                }
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `Unable to save post due to: ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while saving post",
                    });
                }
            }
        });
    }
    getSinglePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { postId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                const user = yield (0, services_1.findUserById)(userId);
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found" });
                }
                const singlepost = yield (0, services_1.singlePost)(postId);
                if (!singlepost) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "Post not found" });
                }
                //convert object post to array so that we can map it
                const updatedPost = [singlepost];
                const postsData = (updatedPost || []).map((post) => {
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
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: "Posts retrieved successfully.",
                    data: postsData,
                });
            }
            catch (error) {
                utils_1.log.info(error.message);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: `Unable to display all posts: error: ${error.message}`,
                });
            }
        });
    }
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const { postId } = req.params;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                const body = req.body;
                const post = yield (0, services_1.findPostById)(postId);
                //check if post exist
                if (!post) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "Post not found" });
                }
                //check if post belongs to user
                if (userId.toString() !== ((_b = post.postedBy) === null || _b === void 0 ? void 0 : _b.toString())) {
                    return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                        message: "Oops! It looks like you can't edit this post. Only the author can make changes.",
                    });
                }
                //then procceds to update the post
                if (body.content)
                    post.content = body.content;
                if (body.caption)
                    post.caption = body.caption;
                if (body.options)
                    post.options = body.options;
                if (body.addCategory)
                    post.addCategory = body.addCategory;
                if (body.tagPeople) {
                    post.tagPeople = body.tagPeople;
                    post.numOfPeopleTag = body.tagPeople.length;
                }
                if (body.products) {
                    post.products = body.products;
                    post.numOfProducts = body.products.length;
                }
                //save updated post
                yield post.save();
                res
                    .status(http_status_codes_1.StatusCodes.OK)
                    .json({ suceess: true, message: "Your post has been updated." });
            }
            catch (error) {
                utils_1.log.info(error.message);
                if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
                    return res.json({ message: "Wrong Id format" });
                }
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: error.message,
                    message: "Unable to update post.",
                });
            }
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const { postId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                const user = yield (0, services_1.findUserById)(userId);
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found" });
                }
                const post = yield (0, services_1.findPostById)(postId);
                if (!post) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "Post not found" });
                }
                //check if post belongs to user
                if (userId.toString() !== ((_b = post.postedBy) === null || _b === void 0 ? void 0 : _b.toString())) {
                    return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                        message: "Oops! It looks like you can't delete this post. Only the author can delete this post.",
                    });
                }
                //remove postId from list of user's post
                user.posts = (_c = user.posts) === null || _c === void 0 ? void 0 : _c.filter((postIds) => postIds.toString() !== postId.toString());
                //reduce number of user's posts
                user.numOfPosts = (_d = user.posts) === null || _d === void 0 ? void 0 : _d.length;
                yield user.save();
                //delete comments associated with post
                const comment = yield model_1.CommentModel.find({ post: postId });
                if (!comment) {
                    //then proceed to delete post
                    yield post.deleteOne();
                }
                else {
                    yield (0, services_1.deleteCommentByPost)(postId);
                    //then proceed to delete replies
                    const reply = yield model_1.ReplyModel.find({ post: postId });
                    if (reply.length > 0) {
                        //then delete replies
                        yield (0, services_1.deleteReplyByPost)(postId);
                        yield post.deleteOne();
                    }
                    else {
                        //if no replies, delete post
                        yield post.deleteOne();
                    }
                }
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: "Your post has been deleted successfully.",
                });
            }
            catch (error) {
                utils_1.log.info(error.message);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: `Unable to delete post due to error: ${error.message}`,
                });
            }
        });
    }
    postByOption(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { option } = req.query;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                const user = yield (0, services_1.findUserById)(userId);
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found" });
                }
                const posts = yield (0, services_1.getPostByOption)(option, userId);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: `List of ${option} posts`,
                    data: posts,
                });
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `Unable to get posts by options due to: ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while getting posts by options",
                    });
                }
            }
        });
    }
}
exports.PostController = PostController;
