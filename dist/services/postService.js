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
exports.findPostByUser = exports.findPostById = exports.createPosts = void 0;
const model_1 = require("../model");
const createPosts = (input) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.PostModel.create(input);
});
exports.createPosts = createPosts;
const findPostById = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.PostModel.findOne({ _id: postId });
});
exports.findPostById = findPostById;
const findPostByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.PostModel.find({ postedBy: userId }).sort({ updatedAt: -1 });
});
exports.findPostByUser = findPostByUser;
// export const timeLinePost = async (userId: string) => {
// 	const user = await UserModel.findOne({ _id: userId });
// 	const followerIds = user?.followers?.map((follower) => follower);
// 	const followingIds = user?.followings?.map((following) => following);
// 	const userPost = await PostModel.find({ postedBy: userId }).sort({
// 		updatedAt: -1,
// 	});
// };
