import { descructiveMenuItemStyle } from '$lib/client/configurations/ui';
import { AppCustomEventType } from '$lib/enums/app-custom-event-type';
import type { MenuConfiguration } from '$lib/models/menu';
import type { UserForm } from '$lib/server/database/schemas/form';
import { DoorOpen, Pen, Power, PowerOff, Trash } from '@lucide/svelte';

export const menuConfiguration: MenuConfiguration<UserForm> = {
	groups: [
		{
			items: [
				{
					icon: DoorOpen,
					event: AppCustomEventType.Open,
					title: 'common.open'
				},
				{
					icon: Pen,
					event: AppCustomEventType.Edit,
					title: 'common.edit'
				},
				{
					icon: PowerOff,
					event: AppCustomEventType.Disable,
					title: 'common.disable_form_sign',
					showIf: (form: UserForm) => !!form.is_active
				},
				{
					icon: Power,
					event: AppCustomEventType.Enable,
					title: 'common.enable_form_sign',
					showIf: (form: UserForm) => !form.is_active
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
