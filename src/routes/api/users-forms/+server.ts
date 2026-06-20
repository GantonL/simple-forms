import { SearchParams } from '$lib/enums/search-params';
import type { UserForm } from '$lib/server/database/schemas/form';
import {
	Service as service,
	getUrlFilters,
	getUrlOptions,
	buildCreateCandidates,
	buildUpdateData,
	getBodyFilters,
	postFindBlock
} from '$lib/server/database/services/user-form';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals }) => {
	const user = locals.user;
	if (user?.id) {
		url.searchParams.append(SearchParams.UserId, user.id);
	}
	const filters = getUrlFilters(url);
	const options = getUrlOptions(url);
	const items = await service.find(filters, options);
	if (options?.renderer) return json(items);
	const isPostFindBlock = await postFindBlock(url, items, user);
	if (isPostFindBlock) return json([]);
	return json(items);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const { data } = await request.json();
	data.forEach((item: UserForm) => {
		item.user_id = locals.user.id;
	});
	const itemsToCreate = buildCreateCandidates(data);
	const created = await service.createMany(itemsToCreate);
	return json(created);
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
