import { StoreModel, StoreInputs } from "../model";

export const createStore = async (input: StoreInputs) => {
	return await StoreModel.create(input);
};

export const findStoreByName = async (storeName: string) => {
	return await StoreModel.findOne({ storeName: storeName });
};
