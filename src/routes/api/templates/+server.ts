import {
	Service as service,
	getUrlFilters,
	getUrlOptions
} from '$lib/server/database/services/form-templates';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const filters = getUrlFilters(url);
	const options = getUrlOptions(url);
	const items = await service.find(filters, options);
	return json(items);
};
