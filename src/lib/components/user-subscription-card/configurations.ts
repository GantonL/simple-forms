import type { DisplaySection } from '$lib/models/common';
import type { Subscription } from '$lib/models/subscription';
import { CalendarOff, CalendarSync, Coins, ShieldUser } from '@lucide/svelte';

export const sections: DisplaySection<Subscription>[] = [
	{
		title: 'common.subscription',
		items: [
			{
				label: 'common.plan',
				key: 'plan_name',
				type: 'badge',
				icon: ShieldUser
			},
			{
				label: 'common.next_payment',
				key: 'next_payment',
				type: 'date',
				icon: Coins,
				hideIf: (sub) => !!sub.cancelled_at,
				class: 'border rounded-sm border-green-400 bg-green-400/20'
			},
			{
				label: 'common.subscription_cancelled',
				key: 'cancelled_at',
				type: 'date',
				icon: CalendarOff,
				hideIf: (sub) => !sub.cancelled_at,
				link: {
					path: '/user/plan/renew',
					label: 'common.click_here_to_renew'
				},
				class: 'border rounded-sm border-amber-400 bg-amber-400/20'
			},
			{
				label: 'common.billing_cycle',
				key: 'billing_cycle_label',
				type: 'text',
				icon: CalendarSync,
				trasformValue: (value) => `common.billing_cycle_labels.${value}`,
				translateValue: true
			}
		]
	}
];
