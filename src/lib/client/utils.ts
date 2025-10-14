import { BaseUrl } from '$lib/api/configurations/common';

export const getPublicFormLink = (identifier: string) => {
	return `${BaseUrl}/f/${identifier}`;
};

export const copyToClipboard = (text: string): Promise<void> => {
	return navigator.clipboard.writeText(text);
};
