export interface PaymentIntentInputs {
	paymentIntentId?: string;
	productIds?: string[];
	buyer?: string;
	vendor?: string | null;
	influencer?: string | null;
}
