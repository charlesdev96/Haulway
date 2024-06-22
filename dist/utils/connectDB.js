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
exports.deletePostsByUser = exports.connectDB = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_codes_1 = require("http-status-codes");
const utils_1 = require("../utils");
const model_1 = require("../model");
const connectDB = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const MONGO_URL = process.env.MONGO_URL;
        if (!MONGO_URL) {
            return res
                .status(http_status_codes_1.StatusCodes.FORBIDDEN)
                .json({ error: "MONGO_URI environment variable is not defined." });
        }
        yield mongoose_1.default.connect(MONGO_URL);
        utils_1.log.info("MongoDB connected successfully!");
    }
    catch (error) {
        utils_1.log.info(error);
    }
});
exports.connectDB = connectDB;
const deletePostsByUser = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Delete posts where postedBy is the specified userId
        const result = yield model_1.StoreModel.deleteMany({
            owner: "666accb5498e380670ab398c",
        });
        console.log(`${result.deletedCount} posts deleted`);
        // Close the database connection
        yield mongoose_1.default.disconnect();
        console.log("Disconnected from the database");
    }
    catch (error) {
        console.error("Error deleting posts:", error);
    }
});
exports.deletePostsByUser = deletePostsByUser;
// const defaultThumbnailUrl =
// 	"https://res.cloudinary.com/dvrg4hiwx/image/upload/v1718886492/haulway/guoiliffqahxrx5aya9l.png";
// export const populateThumbNails = async () => {
// 	const postsToUpdate = await PostModel.find({ thumbNail: { $exists: false } });
// 	for (const post of postsToUpdate) {
// 		const numImages = post?.content?.length; // Assuming content is an array of strings
// 		const defaultThumbNail = []; // Array to store default thumbnails
// 		// Generating default thumbnail URLs based on the provided default URL
// 		for (let i = 0; i < numImages; i++) {
// 			defaultThumbNail.push(defaultThumbnailUrl);
// 		}
// 		// Update the post with the default thumbnail URLs
// 		post.thumbNail = defaultThumbNail;
// 		await post.save();
// 		console.log(
// 			`Updated post ${post._id} with ${numImages} default thumbnails.`,
// 		);
// 	}
// 	console.log("All posts updated successfully.");
// 	mongoose.connection.close();
// };
