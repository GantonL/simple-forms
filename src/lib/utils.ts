import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { locale } from './i18n';
import { AppRoutes } from './client/configurations/routes';
import type { Plans } from './enums/plans';

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

function pathIsHome(path: string): boolean {
	return path === '' || path === '/';
}
export function isRouteRequiresAuthentication(path: string): boolean {
	if (pathIsHome(path)) return false;
	return !!AppRoutes.find((group) => {
		return group.children.find((child) => {
			return (
				(path.startsWith(child.path) || child.path.startsWith(path)) &&
				child.authenticationRequired !== false
			);
		});
	});
}
export function getRouteRequiresPlan(path: string): Plans[] {
	if (pathIsHome(path)) return [];
	for (const group of AppRoutes) {
		if (!group.children) continue;
		for (const child of group.children) {
			if (path.startsWith(child.path) || child.path.startsWith(path)) {
				return child.planRequired ?? [];
			}
		}
	}
	return [];
}
