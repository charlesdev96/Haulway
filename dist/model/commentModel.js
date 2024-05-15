"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CommentSchema = new mongoose_1.default.Schema({
    comment: {
        type: String,
    },
    post: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Post",
    },
    commentedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    numOfReplies: {
        type: Number,
        default: 0,
    },
    replies: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Reply" }],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
exports.CommentModel = mongoose_1.default.model("Comment", CommentSchema);
