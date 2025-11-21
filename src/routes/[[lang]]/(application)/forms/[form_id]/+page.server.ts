import { GET } from '$lib/api/helpers/request';
import { SearchParams } from '$lib/enums/search-params';
import type { FormSubmission, UserForm } from '$lib/server/database/schemas/form';
import { FormsSubmissions, UsersForms } from '../../../../api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, locals, params }) => {
	const userId = locals.user.id;
	const userForm = await GET<UserForm>(
		`${UsersForms}/${params.form_id}?${SearchParams.UserId}=${userId}`,
		{
			fetch
		}
	);
	const submissions = await GET<FormSubmission[]>(
		`${FormsSubmissions}?${SearchParams.FormId}=${userForm.id}`,
		{ fetch }
	);
	return { userForm, submissions };
};
