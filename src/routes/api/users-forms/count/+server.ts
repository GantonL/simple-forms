import { SearchParams } from '$lib/enums/search-params';
import { Service as service, getUrlFilters } from '$lib/server/database/services/user-form';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals }) => {
	const user = locals.user;
	if (user?.id) {
		url.searchParams.append(SearchParams.UserId, user.id);
	}
	const filters = getUrlFilters(url);
	const count = await service.count(filters);
	return json(count);
};
