import { GET } from '$lib/api/helpers/request';
import { SearchParams } from '$lib/enums/search-params';
import {
	type FormTemplate,
	type FormSubmission,
	type UserForm
} from '$lib/server/database/schemas/form';
import {
	FormsSubmissions,
	FormsTemplates,
	FormSubmissionCandidateData,
	UsersForms
} from '../../../../api';
import type { PageServerLoad } from './$types';
import { DEFAULT_ORDER_BY } from './configurations';

export const load: PageServerLoad = async ({ fetch, locals, params, url }) => {
	const searchTerm = url.searchParams.get(SearchParams.FreeSearch) ?? '';
	const userId = locals.user.id;
	const userForm = await GET<UserForm>(
		`${UsersForms}/${params.form_id}?${SearchParams.UserId}=${userId}`,
		{
			fetch
		}
	);
	const submissions = await GET<FormSubmission[]>(
		`${FormsSubmissions}?${SearchParams.FormId}=${userForm.id}&${SearchParams.FreeSearch}=${searchTerm}`,
		{ fetch, orderBy: DEFAULT_ORDER_BY }
	);
	const preProcessedSubmissionsCount = GET<number>(
		`${FormSubmissionCandidateData}/count?${SearchParams.FormId}=${userForm.id}`,
		{ fetch }
	);
	const template = await GET<FormTemplate>(`${FormsTemplates}/${userForm.template_id}`, { fetch });
	return {
		userForm,
		submissions,
		preProcessedSubmissionsCount,
		searchTerm,
		template
	};
};
