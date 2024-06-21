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
