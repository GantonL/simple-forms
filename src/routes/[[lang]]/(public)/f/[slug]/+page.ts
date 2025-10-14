import { GET } from '$lib/api/helpers/request';
import type { FormTemplate, UserForm } from '$lib/server/database/schemas/form';
import { error } from '@sveltejs/kit';
import { FormsTemplates, UsersForms } from '../../../../api';
import type { PageLoad } from './$types';
import { SearchParams } from '$lib/enums/search-params';

export const load: PageLoad = async ({ params, fetch }) => {
	const response: { schema: FormTemplate['schema'] | null; form: Pick<UserForm, 'id'> | null } = {
		schema: null,
		form: null
	};
	const publicLinkIndetifier = params.slug;
	const [userForm] = await GET<UserForm[]>(
		`${UsersForms}?${SearchParams.PublicLinkIdentifier}=${publicLinkIndetifier}&limit=1`,
		{
			fetch
		}
	);
	if (!userForm) {
		error(404);
	}
	response.form = userForm;

	const template = await GET<FormTemplate>(`${FormsTemplates}/${userForm.template_id}`, { fetch });
	if (!template) {
		error(500);
	}
	response.schema = template.schema;
	return response;
};
