import { GET } from '$lib/api/helpers/request';
import { SearchParams } from '$lib/enums/search-params';
import type { FormTemplate } from '$lib/server/database/schemas/form';
import { FormsTemplates } from '../../../api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url, locals }) => {
	const tid = url.searchParams.get(SearchParams.TemplateId);
	const userId = locals.user?.id;
	
	const params = new URLSearchParams();
	if (Number(tid)) params.append(SearchParams.TemplateId, tid as string);
	if (userId) params.append('visible_for_user_id', userId);

	const templates = await GET<FormTemplate[]>(
		`${FormsTemplates}?${params.toString()}`,
		{ fetch }
	);
	return { templates };
};
