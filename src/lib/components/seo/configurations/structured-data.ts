import { BaseDemoUrl } from '$lib/api/configurations/common';

export const Breadcrumbs = {
	'@type': 'BreadcrumbList',
	itemListElement: [
		{
			'@type': 'ListItem',
			position: 1,
			name: 'Home',
			item: `${BaseDemoUrl}`
		},
		{
			'@type': 'ListItem',
			position: 2,
			name: 'Dashboard',
			item: `${BaseDemoUrl}/dashboard`
		},
		{
			'@type': 'ListItem',
			position: 3,
			name: 'Forms',
			item: `${BaseDemoUrl}/forms`
		},
		{
			'@type': 'ListItem',
			position: 4,
			name: 'Templates',
			item: `${BaseDemoUrl}/templates`
		}
	]
};

export const FAQ = {
	'@type': 'FAQPage',
	mainEntity: [
		{
			'@type': 'Question',
			name: 'How do I create a form?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: 'Navigate to the Templates page, select a form template, customize the fields, and save. Your form will be ready to share via a public link.'
			}
		},
		{
			'@type': 'Question',
			name: 'How do I share a form for signatures?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: 'Each form has a unique public link that can be shared with anyone. Recipients can fill out and sign the form without needing an account.'
			}
		},
		{
			'@type': 'Question',
			name: 'Can I track form submissions?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: 'Yes, all form submissions are tracked in real-time. You can view submission details, signatures, and download completed forms from your dashboard.'
			}
		},
		{
			'@type': 'Question',
			name: 'Are the forms secure?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: 'Yes, all forms and submissions are securely stored with encryption. Public links are unique and can only be accessed by those who have the link.'
			}
		},
		{
			'@type': 'Question',
			name: 'Can I edit a form after creating it?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: 'Yes, you can edit form settings, update fields, and manage distribution options at any time from the forms management page.'
			}
		}
	]
};
