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
		const { followers, ...userDetails } = user._doc;
		return { status: status, ...userDetails };
	});
	return data;
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
			select: "_id content",
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
				"_id profilePic userName role numOfPosts fullName profileViews numOfPosts numOfFollowers numOfFollowings store posts products contracts",
			)
			.populate({
				path: "posts",
				select: "_id content desc",
			})
			.populate({
				path: "store",
				select: "_id storeName storeLogo currency products",
			});
	} else if (role === "influencer") {
		return await UserModel.findById(userId)
			.select(
				"_id profilePic userName role numOfPosts fullName profileViews numOfPosts numOfFollowers numOfFollowings store posts products contracts",
			)
			.populate({
				path: "posts",
				select: "_id content desc",
			})
			.populate({
				path: "store",
				select: "_id storeName currency videos",
			});
	} else {
		return await UserModel.findById(userId)
			.select(
				"_id profilePic userName role numOfPosts fullName profileViews numOfPosts numOfFollowers numOfFollowings posts",
			)
			.populate({
				path: "posts",
				select: "_id content desc",
			});
	}
};
