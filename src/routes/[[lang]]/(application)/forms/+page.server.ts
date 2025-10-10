import { GET } from '$lib/api/helpers/request';
import { SearchParams } from '$lib/enums/search-params';
import type { FormTemplate, UserForm } from '$lib/server/database/schemas/form';
import { FormsTemplates, UsersForms } from '../../../api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
	const userId = locals.user.id;
	const userForms = await GET<UserForm[]>(`${UsersForms}?${SearchParams.UserId}=${userId}`, {
		fetch
	});
	const templates = await GET<FormTemplate[]>(FormsTemplates, { fetch });
	return { userForms, templates };
};
