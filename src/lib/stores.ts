import { writable } from 'svelte/store';
import type { MetaTagsProps } from 'svelte-meta-tags';

export const direction = writable<DirectionSetting>('rl');
export const metaTags = writable<MetaTagsProps>();
