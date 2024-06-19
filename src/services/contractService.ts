import { ContractInputs, ContractModel } from "../model";

export const createContract = async (input: ContractInputs) => {
	return await ContractModel.create(input);
};
