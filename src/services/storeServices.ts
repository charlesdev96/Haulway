import { StoreModel, StoreInputs } from "../model";

export const createStore = async (input: StoreInputs) => {
	return await StoreModel.create(input);
};

export const findStoreByName = async (storeName: string) => {
	return await StoreModel.findOne({ storeName: storeName });
};

export const findStoreByUserId = async (userId: string) => {
	return await StoreModel.findOne({ owner: userId });
};

export const findStoreById = async (storeId: string) => {
	return await StoreModel.findById(storeId);
};
