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
exports.CommentController = void 0;
const services_1 = require("../services");
const http_status_codes_1 = require("http-status-codes");
const utils_1 = require("../utils");
class CommentController {
    createComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const body = req.body;
                const { postId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                //find logged in user
                const user = yield (0, services_1.findUserById)(userId);
                //check if user exist
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
                body.commentedBy = userId;
                body.post = postId;
                const comment = yield (0, services_1.createcomment)(body);
                yield ((_b = post.comments) === null || _b === void 0 ? void 0 : _b.push(comment._id));
                post.numOfComments = (_c = post.comments) === null || _c === void 0 ? void 0 : _c.length;
                yield post.save();
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    success: true,
                    message: "Comment successfully submitted!",
                    data: comment,
                });
            }
            catch (error) {
                utils_1.log.info(error.message);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: `Unable to comment on post: ${error.message}`,
                });
            }
        });
    }
    editComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { commentId } = req.params;
                const { comment } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                //find logged in user
                const user = yield (0, services_1.findUserById)(userId);
                //check if user exist
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found" });
                }
                //find comment to be updated
                const comments = yield (0, services_1.findCommentById)(commentId);
                //check if comment exist
                if (!comments) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "Comment not found" });
                }
                //check if comment belong to user
                if (userId.toString() !== ((_b = comments.commentedBy) === null || _b === void 0 ? void 0 : _b.toString())) {
                    return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                        success: false,
                        message: "You can only edit your own comment.",
                    });
                }
                //proceed to update comment
                comments.comment = comment;
                yield comments.save();
                res
                    .status(http_status_codes_1.StatusCodes.OK)
                    .json({ success: true, message: "Your comment has been updated." });
            }
            catch (error) {
                utils_1.log.info(error.message);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: `Unable to edit comment: ${error.message}`,
                });
            }
        });
    }
    deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const { commentId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                //find logged in user
                const user = yield (0, services_1.findUserById)(userId);
                //check if user exist
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found" });
                }
                //find comment to be updated
                const comments = yield (0, services_1.findCommentById)(commentId);
                //check if comment exist
                if (!comments) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "Comment not found" });
                }
                //check if comment belong to user
                if (userId.toString() !== ((_b = comments.commentedBy) === null || _b === void 0 ? void 0 : _b.toString())) {
                    return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                        success: false,
                        message: "You can only edit your own comment.",
                    });
                }
                //reduce the comment on the post
                const postId = comments.post;
                if (!postId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ message: "No postId found" });
                }
                const post = yield (0, services_1.findPostById)(postId);
                if (!post) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "Post not found" });
                }
                //remove comment from post and reduce the numOfComments
                post.comments = (_c = post.comments) === null || _c === void 0 ? void 0 : _c.filter((comment) => comment.toString() !== commentId.toString());
                post.numOfComments = (_d = post.comments) === null || _d === void 0 ? void 0 : _d.length;
                yield post.save();
                //delete replies
                yield (0, services_1.deleteRepliesByCommentId)(commentId);
                //then delete comment
                yield comments.deleteOne();
                res
                    .status(http_status_codes_1.StatusCodes.OK)
                    .json({ success: true, message: "Your comment has been deleted." });
            }
            catch (error) {
                utils_1.log.info(error.message);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: `Unable to delete comment: ${error.message}`,
                });
            }
        });
    }
}
exports.CommentController = CommentController;
