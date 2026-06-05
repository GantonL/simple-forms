import type { DisplaySection } from '$lib/models/common';
import { FileUser, MailCheck, UserRoundPlus } from '@lucide/svelte';
import type { User } from 'better-auth';

export const sections: DisplaySection<User>[] = [
	{
		title: 'common.general_information',
		items: [
			{
				label: 'common.email',
				key: 'email',
				type: 'text',
				icon: MailCheck
			},
			{
				label: 'common.name',
				key: 'name',
				type: 'text',
				icon: FileUser
			},
			{
				label: 'common.created_at',
				key: 'createdAt',
				type: 'date',
				icon: UserRoundPlus
			}
		]
	}
];
