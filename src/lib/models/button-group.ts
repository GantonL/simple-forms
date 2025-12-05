import type { IconProps } from '@lucide/svelte';
import type { Component } from 'svelte';

export interface ButtonGroupItem<T = string> {
	value: T;
	label: string; // i18n key
	icon?: Component<IconProps>;
}

export interface ButtonGroupConfig<T = string> {
	items: ButtonGroupItem<T>[];
}
