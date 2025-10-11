import { GET } from '$lib/api/helpers/request';
import { SearchParams } from '$lib/enums/search-params';
import type { FormTemplate } from '$lib/server/database/schemas/form';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { FormsTemplates } from '../../../../api';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const templateId = url.searchParams.get(SearchParams.TemplateId);
	if (!templateId) {
		error(400);
	}
	const template = await GET<FormTemplate[]>(`${FormsTemplates}/${templateId}`, { fetch });
	return { template };
};
