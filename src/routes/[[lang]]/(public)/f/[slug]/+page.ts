import { GET } from '$lib/api/helpers/request';
import type { FormTemplate, UserForm } from '$lib/server/database/schemas/form';
import { FormsTemplates, UsersForms } from '../../../../api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const publicLinkIndetifier = params.slug;
	const userForm = await GET<UserForm>(`${UsersForms}?pli=${publicLinkIndetifier}&limit=1`, {
		fetch
	});
	const template = await GET<FormTemplate>(`${FormsTemplates}/${userForm.template_id}`, { fetch });

	return {
		schema: template.schema,
		form: {
			id: userForm.id
		}
	};
};
