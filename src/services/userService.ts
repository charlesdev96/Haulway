import { UserDocument, UserInputs, UserModel } from "../model";
import { omit } from "lodash";
import { Request } from "express";
import { compare } from "bcryptjs";

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
		"-password -verificationCode -passwordResetCode -otp",
	);
};

export const existingUser = async (email: string) => {
	return await UserModel.findOne({ email: email });
};

export const findUserById = async (userId: string) => {
	return await UserModel.findOne({ _id: userId });
};

export const getAllUser = async () => {
	return await UserModel.find({})
		.select("_id userName profilePic fullName role")
		.sort({ createdAt: -1 });
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
				"_id profilePic userName role numOfPosts fullName numOfPosts numOfFollowers numOfFollowings store posts products contracts",
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
				"_id profilePic userName role numOfPosts fullName numOfPosts numOfFollowers numOfFollowings store posts products contracts",
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
				"_id profilePic userName role numOfPosts fullName numOfPosts numOfFollowers numOfFollowings posts",
			)
			.populate({
				path: "posts",
				select: "_id content desc",
			});
	}
};
