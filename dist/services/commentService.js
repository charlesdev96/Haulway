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
exports.getAllCommentsByPostId = exports.findCommentById = exports.createcomment = void 0;
const model_1 = require("../model");
const createcomment = (input) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.CommentModel.create(input);
});
exports.createcomment = createcomment;
const findCommentById = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.CommentModel.findOne({ _id: commentId });
});
exports.findCommentById = findCommentById;
const getAllCommentsByPostId = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.CommentModel.find({ post: postId })
        .select("_id comment commentedBy numOfReplies createdAt updatedAt")
        .populate({
        path: "commentedBy",
        select: "_id fullName profilePic",
    })
        .populate({
        path: "replies",
        select: "_id reply replier createdAt updatedAt",
        populate: {
            path: "replier",
            select: "_id fullName profilePic",
        },
    });
});
exports.getAllCommentsByPostId = getAllCommentsByPostId;
