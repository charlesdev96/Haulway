export interface ProductVariation {
	variantColour?: string[] | [];
	variantQuantity?: number | null;
	variantSize?: ("xs" | "s" | "m" | "l" | "xl" | "xxl")[] | [];
}

export interface VenProductGeneralInfo {
	name?: string;
	brand?: string;
	colour?: string[];
	desc?: string;
	category?: string;
	size?: ("xs" | "s" | "m" | "l" | "xl" | "xxl")[];
	gender?: "male" | "female" | "unisex";
	productVar?: ProductVariation;
}

export interface InProductGeneralInfo {
	videoName?: string;
	videoType?: string;
	videoDesc?: string;
	videocategory?: string;
}

export interface Price {
	basePrice?: number;
	discount?: number;
	discountPrice?: number;
	discountType?: string;
	price?: number;
}

export interface Shipping {
	shippingOptions?: "dhl" | "fedex" | "ups";
	refundPolicy?: string;
}

export interface ProductReview {
	products?: string[];
}
export interface Inventory {
	quantity?: number;
	stockStatus?: string;
	productTags?: string[] | [];
}

export interface ProductReviewInputs {
	reviewer?: string;
	product?: string;
	rating?: number;
	comment?: string;
}

interface Product {
	_id?: string;
	genInfo?: VenProductGeneralInfo;
	productPrice?: Price;
	productReview?: ProductReview;
}

export interface ProductStore {
	_id?: string;
	storeName?: string;
	storeLogo?: string;
	products?: Product[];
}

export interface Vendor {
	_id?: string;
	store?: ProductStore;
}

export interface Contract {
	_id?: string;
	vendor?: Vendor;
	products?: Product[];
}
