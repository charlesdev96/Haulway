import {
	VendorProductInputs,
	VendorProductDocument,
	VendorProductModel,
	InfluencerProductInputs,
	InfluencerProductDocument,
	InfluencerProductModel,
	StoreModel,
	ProductReviewModel,
	UserModel,
	ContractModel,
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

export const getProductsForPost = async (userId: string, role: string) => {
	let products: any = [];
	if (role === "vendor") {
		const store = await StoreModel.findOne({ owner: userId })
			.select("products")
			.populate({
				path: "products",
				select: "_id genInfo productPrice productReview store",
				populate: {
					path: "store",
					select: "_id storeLogo storeName",
				},
			});
		if (store && store.products) {
			products = store.products;
		}
	} else {
		const contracts = await ContractModel.find({
			status: "active",
			influencer: userId,
		})
			.select("products")
			.populate({
				path: "products",
				select: "_id genInfo productPrice productReview store",
				populate: {
					path: "store",
					select: "_id storeLogo storeName",
				},
			});
		contracts.forEach((contract) => {
			if (contract.products) {
				products.push(...contract.products);
			}
		});
	}
	return products;
};

export const deleteVendorProduct = async (productId: string) => {
	return await VendorProductModel.deleteOne({ _id: productId });
};

export const deleteVendorProductReview = async (productId: string) => {
	return await ProductReviewModel.deleteMany({ product: productId });
};

export const getVendorProduct = async (userId: string) => {
	return await VendorProductModel.find({ vendor: userId }).select(
		"_id genInfo productPrice productReview createdAt updatedAt",
	);
};

export const getVendorsWithProducts = async () => {
	return await UserModel.find({
		role: "vendor",
		numOfProducts: { $gt: 0 },
	})
		.select("_id profilePic userName fullName store")
		.populate({
			path: "store",
			select: "_id storeLogo storeName numOfProducts",
		});
};

export const myVendorProducts = async (userId: string) => {
	return await VendorProductModel.find({ vendor: userId }).select(
		"_id genInfo productPrice productReview",
	);
};
