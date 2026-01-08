import { GET } from '$lib/api/helpers/request';
import type {
	FormSubmissionCandidateDataSelect,
	FormTemplate,
	UserForm
} from '$lib/server/database/schemas/form';
import { error } from '@sveltejs/kit';
import { FormsTemplates, FormSubmissionCandidateData, UsersForms } from '../../../api';
import { SearchParams } from '$lib/enums/search-params';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch, url }) => {
	const candidateDataId = url.searchParams.get('candidateDataId');
	if (!candidateDataId) {
		error(400);
	}
	const candidateDataRes = await GET<FormSubmissionCandidateDataSelect>(
		`${FormSubmissionCandidateData}/${candidateDataId}`,
		{
			fetch
		}
	);
	if (!candidateDataRes) {
		error(400);
	}
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
	userForm.data = candidateDataRes.data;
	response.form = userForm;

	const template = await GET<FormTemplate>(`${FormsTemplates}/${userForm.template_id}`, { fetch });
	if (!template) {
		error(500);
	}
	response.schema = template.schema;
	return response;
};
