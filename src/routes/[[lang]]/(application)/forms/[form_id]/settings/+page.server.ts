import { GET } from '$lib/api/helpers/request';
import { SearchParams } from '$lib/enums/search-params';
import type { FormSettingsSelect } from '$lib/server/database/schemas/form';
import { UsersForms } from '../../../../../api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, locals, params }) => {
	const userId = locals.user.id;
	// const settings = await GET<FormSettingsSelect>(
	// 	`${UsersForms}/${params.form_id}/settings?${SearchParams.UserId}=${userId}`,
	// 	{
	// 		fetch
	// 	}
	// );
	return { settings: {} };
};
