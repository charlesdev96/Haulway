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
exports.UserActivitiesController = void 0;
const http_status_codes_1 = require("http-status-codes");
const services_1 = require("../services");
const utils_1 = require("../utils");
class UserActivitiesController {
    followUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            try {
                const { targetUserId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                const currentUser = yield (0, services_1.findUserById)(userId);
                if (!currentUser) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found." });
                }
                const targetUser = yield (0, services_1.findUserById)(targetUserId);
                if (!targetUser) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "target user not found." });
                }
                const targetUserFullName = targetUser.fullName;
                // Check if targetUserId already exists in currentUser's followings array
                const alreadyFollowing = (_b = currentUser.followings) === null || _b === void 0 ? void 0 : _b.includes(targetUserId.toString());
                if (alreadyFollowing) {
                    //remove targetUserId from the currentUser followings
                    currentUser.followings = (_c = currentUser.followings) === null || _c === void 0 ? void 0 : _c.filter((following) => following.toString() !== targetUserId.toString());
                    currentUser.numOfFollowings = (_d = currentUser.followings) === null || _d === void 0 ? void 0 : _d.length;
                    yield currentUser.save();
                    //remove currentUser from the target user followers
                    targetUser.followers = (_e = targetUser.followers) === null || _e === void 0 ? void 0 : _e.filter((follower) => follower.toString() !== userId.toString());
                    targetUser.numOfFollowers = (_f = targetUser.followers) === null || _f === void 0 ? void 0 : _f.length;
                    yield targetUser.save();
                    return res.status(http_status_codes_1.StatusCodes.OK).json({
                        success: true,
                        message: `Congratulations!!!, you have successfully unfollowed ${targetUserFullName}`,
                    });
                }
                else {
                    //if not follower user
                    (_g = currentUser.followings) === null || _g === void 0 ? void 0 : _g.push(targetUserId);
                    currentUser.numOfFollowings = (_h = currentUser.followings) === null || _h === void 0 ? void 0 : _h.length;
                    yield currentUser.save();
                    (_j = targetUser.followers) === null || _j === void 0 ? void 0 : _j.push(userId);
                    targetUser.numOfFollowers = (_k = targetUser.followers) === null || _k === void 0 ? void 0 : _k.length;
                    yield targetUser.save();
                    return res.status(http_status_codes_1.StatusCodes.OK).json({
                        success: true,
                        message: `Congratulations!!!, you are now following ${targetUserFullName}`,
                    });
                }
            }
            catch (error) {
                utils_1.log.info(error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: `Unable to follow user. error: ${error.message}`,
                });
            }
        });
    }
    likePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            try {
                const { postId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                //find post you want to like
                const post = yield (0, services_1.findPostById)(postId);
                if (!post) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "Post not found." });
                }
                //check if user have already liked the post
                const alreadyLiked = (_b = post.likes) === null || _b === void 0 ? void 0 : _b.includes(userId.toString());
                if (alreadyLiked) {
                    //if already liked, undo, remove userId from the likes array
                    post.likes = (_c = post.likes) === null || _c === void 0 ? void 0 : _c.filter((like) => like.toString() !== userId.toString());
                    post.numOfLikes = (_d = post.likes) === null || _d === void 0 ? void 0 : _d.length;
                    yield post.save();
                    return res
                        .status(http_status_codes_1.StatusCodes.OK)
                        .json({ success: true, message: "Your like has been removed" });
                }
                else {
                    //like the post
                    (_e = post.likes) === null || _e === void 0 ? void 0 : _e.push(userId);
                    post.numOfLikes = (_f = post.likes) === null || _f === void 0 ? void 0 : _f.length;
                    yield post.save();
                    return res
                        .status(http_status_codes_1.StatusCodes.OK)
                        .json({ success: true, message: "Your like has been counted.!!!" });
                }
            }
            catch (error) {
                utils_1.log.info(error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: `Unable to follow user. error: ${error.message}`,
                });
            }
        });
    }
}
exports.UserActivitiesController = UserActivitiesController;
