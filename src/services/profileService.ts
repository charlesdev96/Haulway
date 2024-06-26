import { UserModel } from "../model";
import { chnageVendorContractStatus } from "../services";

export const getVendorProfile = async (userId: string) => {
	const contracts = await chnageVendorContractStatus(userId);
	// Update the status of the found contracts to 'completed'
	for (const contract of contracts) {
		contract.status = "completed";
		await contract.save();
	}
	return await UserModel.findById(userId)
		.select(
			"_id profilePic fullName userName role numOfFollowers numOfFollowings numOfPosts posts savedPosts store products requests contracts",
		)
		.populate({
			path: "store",
			select: "_id storeLogo storeName",
		})
		.populate({
			path: "posts",
			select:
				"_id content caption postedBy thumbNail views numOfLikes numOfComments comments options tagPeople products",
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
			select: "-__v -reviewers -shippingAndDelivery -store -vendor",
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
				"_id content caption postedBy thumbNail views numOfLikes numOfComments comments options tagPeople products",
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
			path: "contracts",
			select: "-__v -vendor",
			populate: [
				{
					path: "influencer",
					select: "_id fullName profilePic userName role influencerStore",
					populate: {
						path: "influencerStore",
						select: "_id storeName storeLogo",
					},
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
			path: "requests",
			select: "-__v -vendor",
			populate: [
				{
					path: "influencer",
					select: "_id fullName profilePic userName role influencerStore",
					populate: {
						path: "influencerStore",
						select: "_id storeName storeLogo",
					},
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
export const getInfluencerProfile = async (userId: string) => {
	const contracts = await chnageVendorContractStatus(userId);
	// Update the status of the found contracts to 'completed'
	for (const contract of contracts) {
		contract.status = "completed";
		await contract.save();
	}
	return await UserModel.findById(userId)
		.select(
			"_id profilePic fullName userName role numOfFollowers numOfFollowings numOfPosts posts savedPosts influencerPro requests contracts",
		)
		.populate({
			path: "posts",
			select:
				"_id content caption postedBy thumbNail views numOfLikes numOfComments comments options tagPeople products",
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
			path: "influencerPro",
			select: "-__v -store -influencer",
			populate: [
				{
					path: "buyers",
					select: "_id fullName profilePic userName",
				},
			],
		})
		.populate({
			path: "savedPosts",
			select:
				"_id content caption postedBy thumbNail views numOfLikes numOfComments comments options tagPeople products",
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
			path: "contracts",
			select: "-__v -influencer",
			populate: [
				{
					path: "vendor",
					select: "_id fullName profilePic userName role store",
					populate: {
						path: "store",
						select: "_id storeName storeLogo",
					},
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
			path: "requests",
			select: "-__v -influencer",
			populate: [
				{
					path: "vendor",
					select: "_id fullName profilePic userName role store",
					populate: {
						path: "store",
						select: "_id storeName storeLogo",
					},
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
				"_id content caption postedBy thumbNail views numOfLikes numOfComments comments options tagPeople",
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
			],
		})
		.populate({
			path: "savedPosts",
			select:
				"_id content caption postedBy thumbNail views numOfLikes numOfComments comments options tagPeople",
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
