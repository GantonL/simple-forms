import {
	Service as service,
	getUrlFilters,
	getUrlOptions,
	buildCreateCandidates,
	buildUpdateData,
	getBodyFilters
} from '$lib/server/database/services/user-form';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const filters = getUrlFilters(url);
	const options = getUrlOptions(url);
	const items = await service.find(filters, options);
	return json(items);
};

export const POST: RequestHandler = async ({ request }) => {
	const { data } = await request.json();
	const itemsToCreate = buildCreateCandidates(data);
	const created = await service.createMany(itemsToCreate);
	return json({ created });
};

export const PUT: RequestHandler = async ({ url, request }) => {
	const { data, filters } = await request.json();
	const urlFilters = getUrlFilters(url);
	const bodyFilters = getBodyFilters(filters);
	const updateData = buildUpdateData(data);
	const updated = await service.updateWhere([...urlFilters, ...bodyFilters], updateData);
	return json({ updated });
};

export const DELETE: RequestHandler = async ({ url, request }) => {
	const { filters } = await request.json();
	const urlFilters = getUrlFilters(url);
	const bodyFilters = getBodyFilters(filters ?? []);
	const deleted = await service.deleteWhere([...urlFilters, ...bodyFilters]);
	return json({ deleted });
};
