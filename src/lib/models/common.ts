import type { AppCustomEventType } from '$lib/enums/app-custom-event-type';
import type { IconProps } from '@lucide/svelte';
import type { Component } from 'svelte';
import type { Link } from './link';

export interface EmptyResultsConfiguration {
	label: string;
	icon?: Component;
	action?: {
		label: string;
		event: string;
	};
	class?: string;
}

export interface AppCustomEvent<Data = void> {
	type: AppCustomEventType;
	data?: Data;
}

export interface DispalySectionItem<D> {
	label: string;
	key: keyof D;
	type: string;
	icon?: Component<IconProps>;
	hideIf?: (data: D) => boolean;
	link?: Link;
	class?: string;
	trasformValue?: (value: D[keyof D]) => string;
	translateValue?: boolean;
}

export interface DisplaySection<D> {
	title: string;
	items: DispalySectionItem<D>[];
}
