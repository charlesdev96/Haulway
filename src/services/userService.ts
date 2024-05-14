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

export const existingUser = async (email: string) => {
	return await UserModel.findOne({ email: email });
};

export const findUserById = async (userId: string) => {
	return await UserModel.findOne({ _id: userId });
};

export const userProfile = async (email: string) => {
	return await UserModel.findOne({ email: email }).select(
		"-password -verificationCode -passwordResetCode -otp",
	);
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
