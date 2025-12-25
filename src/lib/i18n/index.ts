import i18n, { type Config } from 'sveltekit-i18n';
import { Locale } from '../../routes/api';
import { AvailableLocals } from '$lib/enums/available-locales';

interface Params {
	year?: string;
	number?: number;
	user?: string;
	author?: string;
}

/** @type {import('sveltekit-i18n').Config} */
const config: Config<Params> = {
	loaders: [
		{
			locale: AvailableLocals.Hebrew,
			key: 'common',
			loader: async () => (await import('./he-IL/common.json')).default
		},
		{
			locale: AvailableLocals.Hebrew,
			key: 'seo',
			loader: async () => (await import('./he-IL/seo.json')).default
		},
		{
			locale: AvailableLocals.Hebrew,
			key: 'templates',
			loader: async () => (await import('./he-IL/templates.json')).default
		},
		{
			locale: AvailableLocals.Hebrew,
			key: 'landing',
			loader: async () => (await import('./he-IL/landing.json')).default
		},
		{
			locale: AvailableLocals.English_US,
			key: 'common',
			loader: async () => (await import('./en-US/common.json')).default
		},
		{
			locale: AvailableLocals.English_US,
			key: 'seo',
			loader: async () => (await import('./en-US/seo.json')).default
		},
		{
			locale: AvailableLocals.English_US,
			key: 'templates',
			loader: async () => (await import('./en-US/templates.json')).default
		},
		{
			locale: AvailableLocals.English_US,
			key: 'landing',
			loader: async () => (await import('./en-US/landing.json')).default
		}
	]
};

export const { t, locale, locales, loading, loadTranslations, initialized } = new i18n(config);

export const changeLocale = (newLocale: string) => {
	locale.set(newLocale);
	const formData = new FormData();
	formData.append('locale', newLocale);
	fetch(Locale, { method: 'POST', body: formData });
};
