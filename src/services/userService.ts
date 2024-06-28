import { UserInputs, UserModel } from "../model";
import { omit } from "lodash";
import { Request } from "express";
import { compare } from "bcryptjs";
import { UserData } from "../types";

export const registerUser = async (input: UserInputs) => {
	try {
		const user = await UserModel.create(input);
		return omit(user, "password");
	} catch (error: any) {
		throw new Error(error);
	}
};

export const userProfile = async (email: string) => {
	return await UserModel.findOne({ email: email }).select(
		"_id profilePic fullName userName email role verified numOfPosts deviceType numOfFollowers numOfFollowings createdAt updatedAt profileViews",
	);
};

export const existingUser = async (email: string) => {
	return await UserModel.findOne({ email: email });
};

export const findUserById = async (userId: string) => {
	return await UserModel.findOne({ _id: userId });
};

export const getAllUser = async (userId: string) => {
	//exclude the logged in user
	const users = await UserModel.find({ _id: { $ne: userId } })
		.select("_id userName profilePic fullName role followers")
		.sort({ createdAt: -1 });

	const data: UserData[] = (users || []).map((user: any) => {
		let status = "follow";
		// Check if userId is in the followers array
		if (user.followers.includes(userId.toString())) {
			status = "following";
		}
		// Remove the followers field from postedBy
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { followers, ...userDetails } = user._doc;
		return { status: status, ...userDetails };
	});
	return data;
};

export const getAllUsersByRole = async (role: string, userId: string) => {
	//exclude the user from the list returned
	if (role === "vendor") {
		const topAccount = await UserModel.find({
			role: role,
			_id: { $ne: userId },
		})
			.select("_id profilePic role userName numOfFollowers fullName store")
			.populate({
				path: "store",
				select: "_id storeLogo storeName",
			})
			.sort({ numOfFollowers: -1 });
		const recentAccount = await UserModel.find({
			role: role,
			_id: { $ne: userId },
		})
			.select("_id profilePic role userName numOfFollowers fullName store")
			.populate({
				path: "store",
				select: "_id storeLogo storeName",
			})
			.sort({ createdAt: -1 });
		return { topAccount, recentAccount };
	} else {
		const topAccount = await UserModel.find({
			role: role,
			_id: { $ne: userId },
		})
			.select(
				"_id profilePic role userName fullName numOfFollowers influencerStore",
			)
			.populate({
				path: "influencerStore",
				select: "_id storeLogo storeName",
			})
			.sort({ numOfFollowers: -1 });
		const recentAccount = await UserModel.find({
			role: role,
			_id: { $ne: userId },
		})
			.select(
				"_id profilePic role userName fullName numOfFollowers influencerStore",
			)
			.populate({
				path: "influencerStore",
				select: "_id storeLogo storeName",
			})
			.sort({ createdAt: -1 });
		return { topAccount, recentAccount };
	}
};

export const getAllUsersByRoleForContract = async (
	role: string,
	userId: string,
) => {
	//exclude the user from the list returned
	if (role === "vendor") {
		return await UserModel.find({
			role: role,
			_id: { $ne: userId },
		})
			.select("_id profilePic role userName fullName numOfFollowers store")
			.populate({
				path: "store",
				select: "_id storeLogo storeName",
			})
			.sort({ numOfFollowers: -1 });
	} else {
		return await UserModel.find({
			role: role,
			_id: { $ne: userId },
		})
			.select(
				"_id profilePic role userName fullName numOfFollowers influencerStore",
			)
			.populate({
				path: "influencerStore",
				select: "_id storeLogo storeName",
			})
			.sort({ numOfFollowers: -1 });
	}
};

export const singleUser = async (searchedUserId: string) => {
	// Increment the profileViews by 1
	await UserModel.updateOne(
		{ _id: searchedUserId },
		{ $inc: { profileViews: 1 } },
	);
	return UserModel.findOne({ _id: searchedUserId })
		.select(
			"_id profilePic fullName userName numOfFollowers numOfFollowings numOfPosts followers posts products",
		)
		.populate({
			path: "posts",
			select:
				"_id content caption views thumbNail numOfLikes numOfComments postedBy products createdAt updatedAt numOfPeopleTag addCategory numOfShares",
			populate: [
				{
					path: "postedBy",
					select:
						"_id fullName profilePic userName numOfFollowings numOfFollowers followers",
				},
				{
					path: "products",
					select: "_id genInfo productPrice productReview store",
					populate: {
						path: "store",
						select: "_id storeName storeLogo",
					},
				},
			],
		})
		.populate({
			path: "products",
			select: "-__v -shippingAndDelivery -inventory -vendor -buyers -reviewers",
			populate: [
				{
					path: "store",
					select: "_id storeName storeLogo",
				},
				{
					path: "reviews",
					select: "_id comment rating reviewer",
					populate: {
						path: "reviewer",
						select: "_id fullName profilePic userName",
					},
				},
			],
		});
};

export const userNameExist = async (userName: string) => {
	return await UserModel.findOne({ userName: userName }).select(
		"-password -verificationCode -passwordResetCode -otp",
	);
};

export const validatePassword = async (
	userPassword: string,
	canditatePassword: string,
): Promise<boolean> => {
	return await compare(userPassword, canditatePassword);
};

export interface CustomRequest extends Request {
	user?: {
		userId?: string;
		email?: string;
		role?: string;
	};
}

export const userData = async (role: string, userId: string) => {
	if (role === "vendor") {
		return await UserModel.findById(userId)
			.select(
				"_id profilePic userName role numOfPosts fullName profileViews numOfPosts numOfFollowers numOfFollowings posts store products",
			)
			.populate({
				path: "posts",
				select: "_id content caption products",
				populate: {
					path: "products",
					select: "_id genInfo productPrice productReview numOfProReviews",
				},
			})
			.populate({
				path: "store",
				select: "_id storeName storeLogo currency products",
				populate: {
					path: "products",
					select: "_id genInfo productPrice productReview numOfProReviews",
				},
			})
			.populate({
				path: "products",
				select:
					"_id genInfo productPrice productReview numOfProReviews averageRating",
			});
	} else if (role === "influencer") {
		return await UserModel.findById(userId)
			.select(
				"_id profilePic userName role numOfPosts fullName profileViews numOfPosts numOfFollowers numOfFollowings store posts influencerPro",
			)
			.populate({
				path: "posts",
				select: "_id content caption products",
				populate: {
					path: "products",
					select:
						"_id genInfo productPrice productReview numOfProReviews averageRating",
				},
			})
			.populate({
				path: "store",
				select: "_id storeName storeLogo currency videos influencerProducts",
				populate: {
					path: "influencerProducts",
					select:
						"_id genInfo productPrice productReview numOfProReviews averageRating",
				},
			})
			.populate({
				path: "influencerPro",
				select:
					"_id genInfo productPrice productReview averageRating numOfProReviews",
			});
	} else {
		return await UserModel.findById(userId)
			.select(
				"_id profilePic userName role numOfPosts fullName profileViews numOfPosts numOfFollowers numOfFollowings posts",
			)
			.populate({
				path: "posts",
				select: "_id content caption",
			});
	}
};

export const searchForUsers = async (search: any, userId: string) => {
	const searchRegex = new RegExp(search, "i"); // 'i' for case-insensitive search
	return await UserModel.find({
		$and: [
			{
				$or: [
					{ userName: { $regex: searchRegex } },
					{ fullName: { $regex: searchRegex } },
				],
			},
			{ _id: { $ne: userId } }, // Exclude the logged-in user
		],
	}).select("_id profilePic fullName role userName");
};

export const searchUsersByRole = async (
	search: string,
	role: string,
	userId: string,
) => {
	const searchRegex = new RegExp(search, "i"); // 'i' for case-insensitive search
	return await UserModel.find({
		$and: [
			{ role: role }, // Match the role
			{
				$or: [
					{ userName: { $regex: searchRegex } },
					{ fullName: { $regex: searchRegex } },
				],
			},
			{ _id: { $ne: userId } }, // Exclude the logged-in user
		],
	}).select("_id profilePic fullName userName role");
};

export const loginData = async (userId: string) => {
	return await UserModel.findOne({ _id: userId }).select(
		"_id profilePic userName role numOfPosts fullName profileViews numOfPosts numOfFollowers numOfFollowings",
	);
};
