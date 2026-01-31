import type { BreadcrumbItemConfiguration } from '$lib/models/breadcrumb-item-configuration';
import type { UserForm } from '$lib/server/database/schemas/form';
import { FormsPage, TemplatesPage } from './routes';

export const FormsPageItem: BreadcrumbItemConfiguration = {
	label: FormsPage.label,
	link: FormsPage.path,
	icon: FormsPage.icon
};

export const TemplatesPageItem: BreadcrumbItemConfiguration = {
	label: TemplatesPage.label,
	link: TemplatesPage.path,
	icon: TemplatesPage.icon
};

export const SpecificFormPageItem = (form: UserForm): BreadcrumbItemConfiguration => {
	return {
		label: form.name,
		translateLabel: false,
		link: `/forms/${form.id}`
	};
};
