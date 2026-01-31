import type { BreadcrumbItemConfiguration } from '$lib/models/breadcrumb-item-configuration';
import { FormsPage } from './routes';

export const FormsPageItem: BreadcrumbItemConfiguration = {
	label: FormsPage.label,
	link: FormsPage.path,
	icon: FormsPage.icon
};
