export interface PricingFeature {
	labelKey: string;
	included: boolean;
}

export interface PricingPlan {
	id: string;
	nameKey: string;
	descriptionKey: string;
	price: number;
	currency: string;
	billingPeriod: 'monthly' | 'yearly' | 'one-time';
	features: PricingFeature[];
	ctaLabelKey: string;
	ctaHref: string;
	highlighted?: boolean;
	badgeKey?: string;
}

export const pricingPlans: PricingPlan[] = [
	{
		id: '46138',
		nameKey: 'landing.pricing.plans.basic.name',
		descriptionKey: 'landing.pricing.plans.basic.description',
		price: 4.99,
		currency: 'USD',
		billingPeriod: 'monthly',
		highlighted: true,
		badgeKey: 'landing.pricing.badge_popular',
		features: [
			{ labelKey: 'landing.pricing.plans.basic.features.unlimited_forms', included: true },
			{ labelKey: 'landing.pricing.plans.basic.features.signature_collection', included: true },
			{ labelKey: 'landing.pricing.plans.basic.features.real_time_dashboard', included: true },
			{ labelKey: 'landing.pricing.plans.basic.features.template_library', included: true },
			{ labelKey: 'landing.pricing.plans.basic.features.secure_storage', included: true }
		],
		ctaLabelKey: 'landing.pricing.cta_get_started',
		ctaHref: 'https://checkout.freemius.com/product/27925/plan/46138/'
	}
];
