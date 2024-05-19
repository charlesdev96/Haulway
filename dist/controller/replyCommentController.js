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
exports.ReplyCommentController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
const http_status_codes_1 = require("http-status-codes");
class ReplyCommentController {
    CreateReply(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const body = req.body;
                const { commentId, postId } = req.params;
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
                //check if comment exist
                const comment = yield (0, services_1.findCommentById)(commentId);
                if (!comment) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "comment not found" });
                }
                //proceed to reply a comment
                body.comment = commentId;
                body.replier = userId;
                body.post = postId;
                const reply = yield (0, services_1.createreply)(body);
                yield ((_b = comment.replies) === null || _b === void 0 ? void 0 : _b.push(reply._id));
                comment.numOfReplies = (_c = comment.replies) === null || _c === void 0 ? void 0 : _c.length;
                yield comment.save();
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    success: true,
                    message: "Successfully replied the comment",
                    data: reply,
                });
            }
            catch (error) {
                utils_1.log.info(error.message);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: `Unable to reply comment: ${error.message}`,
                });
            }
        });
    }
    editReply(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { reply } = req.body;
                const { replyId } = req.params;
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
                const replys = yield (0, services_1.findReplyById)(replyId);
                //check if user exist
                if (!replys) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "reply not found" });
                }
                //check if reply belong to user
                if (((_b = replys.replier) === null || _b === void 0 ? void 0 : _b.toString()) !== userId.toString()) {
                    return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                        message: "Oops! It looks like you can't edit this reply. Only the owner can make changes.",
                    });
                }
                //update the reply
                replys.reply = reply;
                //save updated reply
                yield replys.save();
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: "Congratulations!!!, reply has been successfully updated",
                });
            }
            catch (error) {
                utils_1.log.info(error.message);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: `Unable to edit reply comment: ${error.message}`,
                });
            }
        });
    }
    deleteReply(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            try {
                const { replyId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                //find logged in user
                const user = yield (0, services_1.findUserById)(userId);
                //find reply
                const reply = yield (0, services_1.findReplyById)(replyId);
                //check if user exist
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found" });
                }
                if (!reply) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "Reply not found" });
                }
                //check if reply belong to user
                if (userId.toString() !== ((_b = reply.replier) === null || _b === void 0 ? void 0 : _b.toString())) {
                    return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                        message: "Oops! It looks like you can't delete this reply. Only the owner can delete reply.",
                    });
                }
                const commentId = (_c = reply.comment) === null || _c === void 0 ? void 0 : _c.toString();
                if (!commentId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "Comment not found" });
                }
                const comment = yield (0, services_1.findCommentById)(commentId);
                if (!comment) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "comment not found" });
                }
                //reduce the number of comments and remove reply from comment
                comment.replies = (_d = comment.replies) === null || _d === void 0 ? void 0 : _d.filter((reply) => reply.toString() !== replyId.toString());
                comment.numOfReplies = (_e = comment.replies) === null || _e === void 0 ? void 0 : _e.length;
                yield comment.save();
                //proceed to delete reply
                yield reply.deleteOne();
                res
                    .status(http_status_codes_1.StatusCodes.OK)
                    .json({ success: true, message: "Reply successfully deleted" });
            }
            catch (error) {
                utils_1.log.info(error.message);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: `Unable to edit reply comment: ${error.message}`,
                });
            }
        });
    }
}
exports.ReplyCommentController = ReplyCommentController;
