import {
	CartInputs,
	CartItemInputs,
	CartDocuments,
	CartItemDocument,
	CartModel,
	CartItemModel,
} from "../model";

import { Store, CartItem, Product } from "../types";

import { Document } from "mongoose";

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
	// Fetch the cart items
	const cart: Document | null = await CartModel.findOne({ user: userId })
		.select("cartItems")
		.populate({
			path: "cartItems",
			select: "_id store product quantity",
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
		})
		.lean();

	if (!cart) return [];

	// Type assertion to help TypeScript understand the structure
	const cartItems = (cart as any).cartItems as CartItem[];

	const SHIPPING_FEE = 25;

	// Group items by store
	const storeGroups: Record<
		string,
		{
			store: Store;
			items: { cartItemId: string; product: Product; quantity: number }[];
			subtotal: number;
			shipping: number;
			total: number;
		}
	> = {};

	cartItems.forEach((item: CartItem) => {
		const storeId = item.store._id;
		if (!storeGroups[storeId]) {
			storeGroups[storeId] = {
				store: item.store,
				items: [],
				subtotal: 0,
				shipping: SHIPPING_FEE,
				total: 0,
			};
		}
		storeGroups[storeId].items.push({
			cartItemId: item._id,
			product: item.product,
			quantity: item.quantity,
		});
		storeGroups[storeId].subtotal +=
			item.product.productPrice.price * item.quantity;
	});

	// Calculate totals for each store and the grand total
	let grandTotal = 0;
	Object.keys(storeGroups).forEach((storeId) => {
		const storeGroup = storeGroups[storeId];
		storeGroup.total = storeGroup.subtotal + storeGroup.shipping;
		grandTotal += storeGroup.total;
	});

	grandTotal = Number(parseFloat(grandTotal.toFixed(2)));

	// Extract the store group objects into an array with only the items
	const storeGroupsArray = Object.values(storeGroups).map((storeGroup) => ({
		store: storeGroup.store,
		items: storeGroup.items.map((item) => ({
			cartItemId: item.cartItemId,
			product: item.product,
			quantity: item.quantity,
		})),
		subtotal: Number(storeGroup.subtotal.toFixed(2)),
		shipping: Number(storeGroup.shipping.toFixed(2)),
		total: storeGroup.total,
	}));

	return {
		storeGroups: storeGroupsArray,
		grandTotal,
	};
};
