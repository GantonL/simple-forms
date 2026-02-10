import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { locale } from './i18n';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function getFullFormattedDate(date: Date) {
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric'
	};
	return Intl.DateTimeFormat(locale.get(), options).format(new Date(date));
}

export function getSigneeKey(keys: string[], searchKey?: string) {
	return keys.find((k) =>
		searchKey
			? k.includes(searchKey)
			: ['full_name', 'id'].some((defaultkey) => k.includes(defaultkey))
	);
}
