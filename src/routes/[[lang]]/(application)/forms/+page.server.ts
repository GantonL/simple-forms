import { DEFAULT_LIMIT } from '$lib/api/configurations/common';
import { GET } from '$lib/api/helpers/request';
import type { UserForm } from '$lib/server/database/schemas/form';
import { UsersForms } from '../../../api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const userForms = GET<UserForm[]>(`${UsersForms}`, {
		fetch,
		orderBy: '-submissions',
		limit: DEFAULT_LIMIT
	});
	return { userForms };
};
