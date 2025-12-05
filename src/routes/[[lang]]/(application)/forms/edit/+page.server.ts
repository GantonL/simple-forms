import { GET } from '$lib/api/helpers/request';
import { SearchParams } from '$lib/enums/search-params';
import type { FormTemplate, UserForm } from '$lib/server/database/schemas/form';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { FormsTemplates, UsersForms } from '../../../../api';

export const load: PageServerLoad = async ({ fetch, url, locals }) => {
	const userId = locals.user.id;
	const formId = url.searchParams.get(SearchParams.FormId);
	if (!formId) {
		error(400);
	}
	const userForm = await GET<UserForm>(`${UsersForms}/${formId}?${SearchParams.UserId}=${userId}`, {
		fetch
	});
	if (userForm.user_id !== userId) {
		error(403);
	}
	const template = await GET<FormTemplate[]>(`${FormsTemplates}/${userForm.template_id}`, {
		fetch
	});
	return { template, userForm };
};
