import { AppName } from '$lib/api/configurations/common';
import { locale, t } from '$lib/i18n';
import type { MetaTagsProps } from 'svelte-meta-tags';

export const getBaseMetaTags = ({ url }: { url: URL }) => {
	const brandName = t.get('common.brand.name');
	const brandDescription = t.get('seo.description');
	const currentLocale = locale.get();
	const alternateLocale = currentLocale === 'en-US' ? 'he-IL' : 'en-US';
	const canonicalUrl = new URL(url.pathname, url.origin).href;

	return {
		title: brandName,
		description: brandDescription,
		canonical: canonicalUrl,
		languageAlternates: [
			{
				hrefLang: 'en-US',
				href: canonicalUrl.replace(`/${currentLocale}`, '/en-US')
			},
			{
				hrefLang: 'he-IL',
				href: canonicalUrl.replace(`/${currentLocale}`, '/he-IL')
			},
			{
				hrefLang: 'x-default',
				href: canonicalUrl.replace(`/${currentLocale}`, '/en-US')
			}
		],
		additionalMetaTags: [
			{
				name: 'keywords',
				content:
					'digital forms, form builder, signature collection, form management, online forms, form templates, document signing'
			},
			{
				name: 'robots',
				content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
			},
			{
				name: 'author',
				content: AppName
			},
			{
				name: 'application-name',
				content: brandName
			}
		],
		openGraph: {
			type: 'website',
			url: canonicalUrl,
			locale: currentLocale,
			siteName: AppName,
			title: brandName,
			description: brandDescription,
			images: [
				{
					url: new URL('/og-image.png', url.origin).href,
					width: 1200,
					height: 630,
					alt: brandName
				}
			]
		},
		twitter: {
			cardType: 'summary_large_image',
			title: brandName,
			description: brandDescription,
			image: new URL('/og-image.png', url.origin).href,
			imageAlt: brandName
		}
	} satisfies MetaTagsProps;
};

export const getTitleTemplate = () => {
	return `%s • ${t.get('common.brand.name')}`;
};
