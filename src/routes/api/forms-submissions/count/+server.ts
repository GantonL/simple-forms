import { Service as service, getUrlFilters } from '$lib/server/database/services/form-submissions';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const filters = getUrlFilters(url);
	const count = await service.count(filters);
	return json(count);
};
