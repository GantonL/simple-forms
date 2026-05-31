export interface Subscription {
	id: string;
	plan_id: number;
	plan_name: string;
	billing_cycle_label: string;
	status: 'cancelled' | 'active' | 'past_due';
	next_payment: Date;
	cancelled_at?: Date;
}
