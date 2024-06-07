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
	shippingOptions?: "dhl" | "fedx" | "ups";
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
