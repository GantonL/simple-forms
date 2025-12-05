import type { IconProps } from '@lucide/svelte';
import type { Component } from 'svelte';

export interface MarkdownToolbarItem {
	id: string;
	label: string; // i18n key
	icon: Component<IconProps>;
	action: (textarea: HTMLTextAreaElement) => void;
}

export interface MarkdownToolbarConfig {
	items: MarkdownToolbarItem[];
}
