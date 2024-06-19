import { UserModel } from "../model";

export const getVendorProfile = async (userId: string) => {
	return await UserModel.findById(userId)
		.select(
			"_id profilePic fullName userName role numOfFollowers numOfFollowings numOfPosts posts savedPosts products requests contracts",
		)
		.populate({
			path: "posts",
			select:
				"_id content caption postedBy views numOfLikes numOfComments comments options tagPeople products",
			populate: [
				{
					path: "postedBy",
					select:
						"_id fullName profilePic userName numOfFollowings numOfFollowers",
				},
				{
					path: "tagPeople",
					select: "_id fullName userName profilePic",
				},
				{
					path: "comments",
					select:
						"_id comment numOfReplies replies createdAt updatedAt commentedBy",
					populate: [
						{
							path: "replies",
							select: "_id reply replier createdAt updatedAt",
							populate: {
								path: "replier",
								select: "_id fullName userName profilePic",
							},
						},
						{
							path: "commentedBy",
							select: "_id fullName userName profilePic",
						},
					],
				},
				{
					path: "products",
					select:
						"_id genInfo productPrice productReview numOfProReviews reviews",
					populate: {
						path: "reviews",
						select: "_id comment rating reviewer",
						populate: {
							path: "reviewer",
							select: "_id fullName profilePic userName",
						},
					},
				},
			],
		})
		.populate({
			path: "products",
			select: "-__v -reviewers",
			populate: [
				{
					path: "reviews",
					select: "_id comment rating reviewer",
					populate: {
						path: "reviewer",
						select: "_id fullName profilePic userName",
					},
				},
				{
					path: "buyers",
					select: "_id fullName profilePic userName",
				},
			],
		})
		.populate({
			path: "savedPosts",
			select:
				"_id content caption postedBy views numOfLikes numOfComments comments options tagPeople products",
			populate: [
				{
					path: "postedBy",
					select:
						"_id fullName profilePic userName numOfFollowings numOfFollowers",
				},
				{
					path: "tagPeople",
					select: "_id fullName userName profilePic",
				},
				{
					path: "comments",
					select:
						"_id comment numOfReplies replies createdAt updatedAt commentedBy",
					populate: [
						{
							path: "replies",
							select: "_id reply replier createdAt updatedAt",
							populate: {
								path: "replier",
								select: "_id fullName userName profilePic",
							},
						},
						{
							path: "commentedBy",
							select: "_id fullName userName profilePic",
						},
					],
				},
				{
					path: "products",
					select:
						"_id genInfo productPrice productReview numOfProReviews reviews",
					populate: {
						path: "reviews",
						select: "_id comment rating reviewer",
						populate: {
							path: "reviewer",
							select: "_id fullName profilePic userName",
						},
					},
				},
			],
		});
};

export const getUserProfile = async (userId: string) => {
	return await UserModel.findById(userId)
		.select(
			"_id profilePic fullName userName role numOfFollowers numOfFollowings numOfPosts posts savedPosts",
		)
		.populate({
			path: "posts",
			select:
				"_id content caption postedBy views numOfLikes numOfComments comments options tagPeople",
			populate: [
				{
					path: "postedBy",
					select:
						"_id fullName profilePic userName numOfFollowings numOfFollowers followers",
				},
				{
					path: "tagPeople",
					select: "_id fullName userName profilePic",
				},
				{
					path: "comments",
					select:
						"_id comment numOfReplies replies createdAt updatedAt commentedBy",
					populate: [
						{
							path: "replies",
							select: "_id reply replier createdAt updatedAt",
							populate: {
								path: "replier",
								select: "_id fullName userName profilePic",
							},
						},
						{
							path: "commentedBy",
							select: "_id fullName userName profilePic",
						},
					],
				},
			],
		});
};
