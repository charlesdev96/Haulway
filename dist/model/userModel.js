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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = require("bcryptjs");
const UserSchema = new mongoose_1.default.Schema({
    profilePic: {
        type: String,
        default: "",
    },
    stripe_id: {
        type: String,
        default: null,
    },
    stripe_url: {
        type: String,
        default: null,
    },
    fullName: {
        type: String,
        required: [true, "Please provide full name"],
    },
    userName: {
        type: String,
        default: "",
    },
    password: {
        type: String,
        required: [true, "Please provide full name"],
        min: 6,
    },
    email: {
        type: String,
        required: [true, "Please provide email address"],
        unique: true,
    },
    role: {
        type: String,
        enum: ["user", "influencer", "vendor", "admin", "tutor"],
        default: "user",
    },
    verified: {
        type: Boolean,
        default: false,
    },
    numOfPosts: {
        type: Number,
        default: 0,
    },
    numOfProducts: {
        type: Number,
        default: 0,
    },
    profileViews: {
        type: Number,
        default: 0,
    },
    deviceType: {
        type: String,
        enum: ["android", "ios"],
        default: "android",
    },
    otp: {
        type: Number,
        default: null,
    },
    otpExpirationDate: { type: Date, default: null },
    posts: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Post" }],
    savedPosts: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Post", default: [] },
    ],
    address: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Address" }],
    products: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "VendorProduct" }],
    influencerPro: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: "InfluencerProduct" },
    ],
    store: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Store" },
    numOfFollowers: {
        type: Number,
        default: 0,
    },
    numOfFollowings: {
        type: Number,
        default: 0,
    },
    followers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
    followings: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
    carts: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Cart" }],
    contracts: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Contract" }],
    requests: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Contract", default: [] },
    ],
    orderHistory: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Order" }],
    productsDelivered: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: "VendorProduct" },
    ],
    productsSold: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: "VendorProduct" },
    ],
}, { timestamps: true });
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return;
        const salt = yield (0, bcryptjs_1.genSalt)(10);
        this.password = yield (0, bcryptjs_1.hashSync)(this.password, salt);
        next();
    });
});
exports.UserModel = mongoose_1.default.model("User", UserSchema);
