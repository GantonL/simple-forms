import { GET } from '$lib/api/helpers/request';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const formId = params.slug;
	// const data = await GET<FormRender>(`${PublicForms}/${formId}`, { fetch });
	// return { data };
	return { formId };
};
