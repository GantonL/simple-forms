import {
	getUrlFilters,
	Service as service
} from '$lib/server/database/services/forms-submissions-candidate-data';
import { json, type RequestHandler } from '@sveltejs/kit';
import { defaultCreateDateFilter } from '../configurations';
export const GET: RequestHandler = async ({ url }) => {
	const filters = getUrlFilters(url);
	filters.push(defaultCreateDateFilter);
	const count = await service.count(filters);
	return json(count);
};
