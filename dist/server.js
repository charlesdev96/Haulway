"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
const utils_1 = require("./utils");
const setupSocket = (io) => {
    io.on("connection", (socket) => {
        utils_1.log.info("user connected", socket.id);
        io.on("disconnect", () => {
            utils_1.log.info("user disconnected");
        });
    });
};
exports.setupSocket = setupSocket;
//watch out for new posts
// PostModel.watch().on("change", async (change) => {
//     const postId = change.documentKey._id;
//     if (change.operationType === "insert") {
//         const newPost = await PostModel.findById(postId);
//         if (newPost) {
//             const postedBy = await UserModel.findById(newPost.postedBy);
//             io.emit("newPost", {
//                 content: newPost.content,
//                 desc: newPost.desc || "",
//                 fullName: postedBy?.fullName,
//                 userName: postedBy?.userName || "",
//                 profilePic: postedBy?.profilePic || "",
//             });
//         }
//     } else if (change.operationType === "update") {
//         const updatedPost = await PostModel.findById(postId);
//         if (updatedPost) {
//             io.emit("updatedPost", {
//                 postId,
//                 content: updatedPost.content,
//                 desc: updatedPost.desc || "",
//                 numOfViews: updatedPost.views,
//                 numOfComments: updatedPost.numOfComments,
//                 numOfLikes: updatedPost.numOfLikes,
//                 numOfPeopleTag: updatedPost.numOfPeopleTag,
//                 numOfShares: updatedPost.numOfShares,
//                 addLocation: updatedPost.addLocation,
//                 addMusic: updatedPost.addMusic,
//                 addCategory: updatedPost.addCategory,
//             });
//         }
//     } else if (change.operationType === "delete") {
//         io.emit("deletedPost", {
//             postId,
//         });
//     }
// });
// //watch out for new comment
// CommentModel.watch().on("change", async (change) => {
//     const commentId = change.documentKey._id;
//     if (change.operationType === "insert") {
//         const newComment = await CommentModel.findById(commentId);
//         if (newComment) {
//             const post = await PostModel.findById(newComment.post?.toString());
//             const user = await UserModel.findById(
//                 newComment.commentedBy?.toString(),
//             );
//             io.emit("newComment", {
//                 _id: newComment._id,
//                 comment: newComment.comment,
//                 postId: post?._id,
//                 commentedById: user?._id,
//                 commentedBy: {
//                     _id: user?._id,
//                     fullName: user?.fullName,
//                     userName: user?.userName || "",
//                     profilePic: user?.profilePic || "",
//                 },
//             });
//         }
//     } else if (change.operationType === "update") {
//     }
// });
