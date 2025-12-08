import { GET } from '$lib/api/helpers/request';
import type { FormTemplate } from '$lib/server/database/schemas/form';
import { FormsTemplates } from '../../../api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const templates = await GET<FormTemplate[]>(FormsTemplates, { fetch });
	return { templates };
};
