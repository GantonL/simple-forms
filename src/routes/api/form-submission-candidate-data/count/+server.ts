import {
	getUrlFilters,
	Service as service
} from '$lib/server/database/services/forms-submissions-candidate-data';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const filters = getUrlFilters(url);
	const count = await service.count(filters);
	return json(count);
};
