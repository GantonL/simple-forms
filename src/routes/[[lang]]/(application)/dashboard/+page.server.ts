import { GET } from '$lib/api/helpers/request';
import { SearchParams } from '$lib/enums/search-params';
import type { FormTemplate, UserForm } from '$lib/server/database/schemas/form';
import { FormsTemplates, UsersForms } from '../../../api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
	const response: {
		templates: Record<FormTemplate['id'], FormTemplate> | null;
		forms: UserForm[] | null;
	} = {
		templates: null,
		forms: null
	};
	const userId = locals.user.id;
	const userForms = await GET<UserForm[]>(`${UsersForms}?${SearchParams.UserId}=${userId}`, {
		fetch
	});
	if (!userForms || userForms.length === 0) {
		return response;
	}
	response.forms = userForms;

	const templates: typeof response.templates = {};
	for (const form of userForms) {
		const template = await GET<FormTemplate>(`${FormsTemplates}/${form.template_id}`, { fetch });
		templates[template.id] = template;
	}

	response.templates = templates;
	console.log(response);
	return response;
};
