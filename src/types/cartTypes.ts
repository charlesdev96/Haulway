// Define the types for better TypeScript support
export interface Store {
	_id: string;
	storeName: string;
	storeLogo: string;
}

export interface Product {
	genInfo: {
		productVar: {
			variantColour: string[];
			variantQuantity: number;
			variantSize: string[];
		};
		name: string;
		brand: string;
		colour: string[];
		desc: string;
		category: string;
		size: string[];
		gender: string;
	};
	productPrice: {
		basePrice: number;
		discountPrice: number;
		discount: number;
		discountType: string;
		price: number;
	};
	productReview: {
		products: string[];
	};
}

export interface CartItem {
	_id: string;
	store: Store;
	product: Product;
	quantity: number;
}

export interface Cart {
	_id: string;
	cartItems: CartItem[];
}
