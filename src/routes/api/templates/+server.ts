import {
	Service as service,
	getUrlFilters,
	getUrlOptions,
	buildCreateCandidates
} from '$lib/server/database/services/form-templates';
import { FormTemplateTable } from '$lib/server/database/schemas/form';
import { or, eq, isNull } from 'drizzle-orm';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const filters = getUrlFilters(url);
	const options = getUrlOptions(url);
	const items = await service.find(filters, options);
	return json(items);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const { data } = await request.json();
	console.log(data);
	data.forEach((item: any) => {
		if (locals.user?.id) {
			item.user_id = locals.user.id;
		}
	});
	const itemsToCreate = buildCreateCandidates(data);
	const created = await service.createMany(itemsToCreate);
	return json(created);
};
