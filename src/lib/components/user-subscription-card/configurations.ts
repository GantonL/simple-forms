import type { DisplaySection } from '$lib/models/common';
import type { Subscription } from '$lib/models/subscription';
import { CalendarSync, ShieldUser } from '@lucide/svelte';

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
				label: 'common.expiration',
				key: 'next_payment',
				type: 'date',
				icon: CalendarSync
			}
		]
	}
];
