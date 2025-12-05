import type { ButtonGroupConfig } from '$lib/models/button-group';
import { Pencil, Eye } from '@lucide/svelte';

type EditableTextMode = 'edit' | 'preview';

export const ModeToggleConfiguration: ButtonGroupConfig<EditableTextMode> = {
	items: [
		{
			value: 'edit',
			label: 'common.edit',
			icon: Pencil
		},
		{
			value: 'preview',
			label: 'common.form_builder.preview',
			icon: Eye
		}
	]
};
