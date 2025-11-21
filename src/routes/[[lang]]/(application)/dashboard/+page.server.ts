import { GET } from '$lib/api/helpers/request';
import { SearchParams } from '$lib/enums/search-params';
import type { FormSubmission, UserForm } from '$lib/server/database/schemas/form';
import { FormsSubmissions, UsersForms } from '../../../api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
	const response: {
		forms: UserForm[];
		submissions: FormSubmission[];
		totalSubmissions: number;
	} = {
		submissions: [],
		forms: [],
		totalSubmissions: 0
	};
	const userId = locals.user.id;
	const userForms = await GET<UserForm[]>(`${UsersForms}?${SearchParams.UserId}=${userId}`, {
		fetch
	});
	if (!userForms || userForms.length === 0) {
		return response;
	}
	response.forms = userForms;

	const submissions = await GET<FormSubmission[]>(
		`${FormsSubmissions}?${SearchParams.FormId}=${userForms[0].id}`,
		{ fetch }
	);
	response.submissions = submissions;
	response.totalSubmissions = userForms[0].submissions ?? 0;
	return response;
};
