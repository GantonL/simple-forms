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
