"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    content: [
        {
            type: String,
            required: true,
        },
    ],
    desc: {
        type: String,
    },
    postedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    views: {
        type: Number,
        default: 0,
    },
    numOfLikes: {
        type: Number,
        default: 0,
    },
    numOfComments: {
        type: Number,
        default: 0,
    },
    comments: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Comment" }],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
exports.PostModel = mongoose_1.default.model("Post", PostSchema);
