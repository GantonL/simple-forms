import type { MenuConfiguration } from '$lib/models/menu';

export const descructiveMenuItemStyle: Pick<
	MenuConfiguration['groups'][0]['items'][0],
	'class' | 'iconClass' | 'variant'
> = {
	class: 'bg-destructive/30 text-destructive',
	iconClass: 'not:hover:text-destructive'
};
