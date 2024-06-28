import { ContractInputs, ContractModel, UserModel } from "../model";

export const createContract = async (input: ContractInputs) => {
	return await ContractModel.create(input);
};

export const findContractById = async (contractId: string) => {
	return await ContractModel.findById(contractId);
};

export const findContractors = async (contractorId: string) => {
	return await UserModel.findOne({ _id: contractorId });
};

export const chnageVendorContractStatus = async (userId: string) => {
	const now = new Date();
	return await ContractModel.find({
		vendor: userId,
		completionDate: { $lte: now },
		status: { $ne: "completed" },
	});
};

export const getSingleContractByRole = async (
	role: string,
	contractId: string,
) => {
	if (role === "vendor") {
		return await ContractModel.findById(contractId)
			.select("-__v -vendor")
			.populate({
				path: "influencer",
				select:
					"_id fullName profilePic userName numOfFollowers role influencerStore",
				populate: {
					path: "influencerStore",
					select: "_id storeName storeLogo",
				},
			})
			.populate({
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
			});
	} else {
		return await ContractModel.findById(contractId)
			.select("-__v -influencer")
			.populate({
				path: "vendor",
				select: "_id fullName profilePic userName numOfFollowers role store",
				populate: {
					path: "store",
					select: "_id storeName storeLogo",
				},
			})
			.populate({
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
			});
	}
};

export const getSingleRequestByRole = async (
	role: string,
	contractId: string,
) => {
	if (role === "vendor") {
		return await ContractModel.findById(contractId)
			.select("-__v -vendor")
			.populate({
				path: "influencer",
				select:
					"_id fullName profilePic userName numOfFollowers role influencerStore",
				populate: {
					path: "influencerStore",
					select: "_id storeName storeLogo",
				},
			})
			.populate({
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
			});
	} else {
		return await ContractModel.findById(contractId)
			.select("-__v -influencer")
			.populate({
				path: "vendor",
				select: "_id fullName profilePic userName numOfFollowers role store",
				populate: {
					path: "store",
					select: "_id storeName storeLogo",
				},
			})
			.populate({
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
			});
	}
};
