import type { IconProps } from '@lucide/svelte';
import type { Component } from 'svelte';

export interface BreadcrumbItemConfiguration {
	label: string;
	link: string;
	icon?: Component<IconProps>;
	translateLabel?: boolean;
}
