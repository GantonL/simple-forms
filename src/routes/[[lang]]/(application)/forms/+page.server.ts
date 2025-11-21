import { GET } from '$lib/api/helpers/request';
import { SearchParams } from '$lib/enums/search-params';
import type { UserForm } from '$lib/server/database/schemas/form';
import { UsersForms } from '../../../api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
	const userId = locals.user.id;
	const userForms = await GET<UserForm[]>(`${UsersForms}?${SearchParams.UserId}=${userId}`, {
		fetch
	});
	return { userForms };
};
