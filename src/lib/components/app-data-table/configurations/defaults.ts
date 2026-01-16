import { locale } from '$lib/i18n';
import type { ComboboxConfiguration } from '$lib/models/combobox';

export const pageSizeOptionsConfiguration: ComboboxConfiguration = {
	options: [
		{ label: '10', noTranslationRequired: true, value: '10' },
		{ label: '25', noTranslationRequired: true, value: '25' },
		{ label: '50', noTranslationRequired: true, value: '50' },
		{ label: '75', noTranslationRequired: true, value: '75' },
		{ label: '100', noTranslationRequired: true, value: '100' }
	],
	event: 'page_size'
};

export function defaultDateCell(date: Date) {
	if (!date) return;
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
