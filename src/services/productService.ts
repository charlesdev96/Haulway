import {
	VendorProductInputs,
	VendorProductDocument,
	VendorProductModel,
	InfluencerProductInputs,
	InfluencerProductDocument,
	InfluencerProductModel,
} from "../model";

export const findVendorProductById = async (productId: string) => {
	return await VendorProductModel.findById(productId);
};

export const findInfluencerProductById = async (productId: string) => {
	return await InfluencerProductModel.findById(productId);
};

export const createNewVendorProduct = async (
	input: VendorProductInputs,
): Promise<VendorProductDocument> => {
	return await VendorProductModel.create(input);
};

export const createNewInfluencerProduct = async (
	input: InfluencerProductInputs,
): Promise<InfluencerProductDocument> => {
	return await InfluencerProductModel.create(input);
};
