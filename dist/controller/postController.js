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
exports.PostController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
const http_status_codes_1 = require("http-status-codes");
class PostController {
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
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
                const post = yield (0, services_1.createPosts)(body);
                //push post._id
                (_b = user.posts) === null || _b === void 0 ? void 0 : _b.push(post._id);
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
                    .json({ success: false, message: "Unable to create post" });
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
                        .json({ error: "Post not found" });
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
                if (body.desc)
                    post.desc = body.desc;
                //save updated post
                post.save();
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
}
exports.PostController = PostController;
