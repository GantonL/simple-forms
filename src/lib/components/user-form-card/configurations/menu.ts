import { descructiveMenuItemStyle } from '$lib/client/configurations/ui';
import { AppCustomEventType } from '$lib/enums/app-custom-event-type';
import type { MenuConfiguration } from '$lib/models/menu';
import type { UserForm } from '$lib/server/database/schemas/form';
import { Eye, Pen, Trash } from '@lucide/svelte';

export const menuConfiguration: MenuConfiguration<UserForm> = {
	groups: [
		{
			items: [
				{
					icon: Eye,
					event: AppCustomEventType.View,
					title: 'common.view'
				},
				{
					icon: Pen,
					event: AppCustomEventType.Edit,
					title: 'common.edit'
				},
				{
					icon: Trash,
					event: AppCustomEventType.Delete,
					title: 'common.delete',
					...structuredClone(descructiveMenuItemStyle)
				}
			]
		}
	],
	hideLabelOnSmallScreen: true
};
