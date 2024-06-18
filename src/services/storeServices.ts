import {
	StoreModel,
	StoreInputs,
	InfluencerStoreInputs,
	InfluencerStoreModel,
} from "../model";

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

export const createInfluencerStore = async (input: InfluencerStoreInputs) => {
	return await InfluencerStoreModel.create(input);
};

export const findInfluencerStoreByName = async (storeName: string) => {
	return await InfluencerStoreModel.findOne({ storeName: storeName });
};

export const findInfluencerStoreByUserId = async (userId: string) => {
	return await InfluencerStoreModel.findOne({ owner: userId });
};

export const findInfluencerStoreById = async (storeId: string) => {
	return await InfluencerStoreModel.findById(storeId);
};

export const getVendorStore = async (storeId: string) => {
	return await StoreModel.findById(storeId)
		.select("-__v")
		.populate({
			path: "owner",
			select: "_id profilePic fullName userName",
		})
		.populate({
			path: "products",
			select: "-reviewers -buyers -vendor -store",
			populate: {
				path: "reviews",
				select: "_id comment rating reviewer",
				populate: {
					path: "reviewer",
					select: "_id profilePic fullName userName",
				},
			},
		});
};
