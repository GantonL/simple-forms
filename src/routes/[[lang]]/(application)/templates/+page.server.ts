import { GET } from '$lib/api/helpers/request';
import { SearchParams } from '$lib/enums/search-params';
import type { FormTemplate } from '$lib/server/database/schemas/form';
import { FormsTemplates } from '../../../api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const tid = url.searchParams.get(SearchParams.TemplateId);
	const templates = await GET<FormTemplate[]>(
		`${FormsTemplates}?${SearchParams.TemplateId}=${tid}`,
		{ fetch }
	);
	return { templates };
};
