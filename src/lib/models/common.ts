import type { AppCustomEventType } from '$lib/enums/app-custom-event-type';
import type { Component } from 'svelte';

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
	icon?: Component;
	hideIf?: (data: D) => boolean;
}

export interface DisplaySection<D> {
	title: string;
	items: DispalySectionItem<D>[];
}
