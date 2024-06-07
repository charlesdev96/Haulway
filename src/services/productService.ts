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

export const updateVendorProduct = async (
	productId: string,
	updates: Partial<VendorProductInputs>,
) => {
	return await VendorProductModel.findOneAndUpdate(
		{ _id: productId },
		updates,
		{ new: true, runValidators: true },
	);
};

export const updateInfluencerProduct = async (
	productId: string,
	updates: Partial<InfluencerProductInputs>,
) => {
	return await InfluencerProductModel.updateOne(
		{ _id: productId },
		{ $set: updates },
	);
};
