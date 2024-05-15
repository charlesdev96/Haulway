"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplyModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ReplySchema = new mongoose_1.default.Schema({
    reply: { type: String },
    comment: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Comment",
    },
    replier: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
exports.ReplyModel = mongoose_1.default.model("Reply", ReplySchema);
