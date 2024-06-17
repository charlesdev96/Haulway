import {
	CartInputs,
	CartItemInputs,
	CartDocuments,
	CartItemDocument,
	CartModel,
	CartItemModel,
} from "../model";

export const createCartFirstTime = async (
	inputs: CartInputs,
): Promise<CartDocuments> => {
	return await CartModel.create(inputs);
};

export const addItemToCart = async (
	inputs: CartItemInputs,
): Promise<CartItemDocument> => {
	return await CartItemModel.create(inputs);
};

export const checkIfProductInUserCart = async (
	productId: string,
	cartId: string,
) => {
	return await CartItemModel.findOne({ product: productId, cart: cartId });
};

export const checkIfUserCartExist = async (userId: string) => {
	return await CartModel.findOne({ user: userId });
};

export const findCartItemById = async (cartItemId: string) => {
	return await CartItemModel.findById(cartItemId);
};

export const getUserCartItems = async (userId: string) => {
	return await CartModel.findOne({ user: userId })
		.select("_id cartItems")
		.populate({
			path: "cartItems",
			select: "store product quantity",
			populate: [
				{
					path: "store",
					select: "_id storeName storeLogo",
				},
				{
					path: "product",
					select: "genInfo productPrice productReview",
				},
			],
		});
};
