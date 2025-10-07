import { GET } from '$lib/api/helpers/request';
import type { UserForm } from '$lib/server/database/schemas/form';
import { UsersForms } from '../../../../api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const publicLinkIndetifier = params.slug;
	const data = await GET<UserForm>(`${UsersForms}?pli=${publicLinkIndetifier}&limit=1`, { fetch });
	return { data };
};
