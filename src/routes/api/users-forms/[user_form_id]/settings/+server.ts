import { FormSettingsTable } from '$lib/server/database/schemas/form';
import {
	Service as service,
	buildUpdateData,
	getUrlOptions,
	buildCreateCandidates
} from '$lib/server/database/services/form-settings';
import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params, url }) => {
	const options = getUrlOptions(url);
	options.select = {
		id: FormSettingsTable.id,
		user_form_id: FormSettingsTable.user_form_id,
		notifications: FormSettingsTable.notifications
	};
	const userFormId = Number(params.user_form_id);
	const item = await service.findOne(eq(FormSettingsTable.user_form_id, userFormId), options);
	return json(item ?? {});
};

export const POST: RequestHandler = async ({ request, params }) => {
	const { data } = await request.json();
	const userFormId = Number(params.user_form_id);
	const itemsToCreate = buildCreateCandidates([{ ...data, user_form_id: userFormId }]);
	const created = await service.createMany(itemsToCreate);
	return json(created?.length > 0 ? created[0] : null);
};

export const PUT: RequestHandler = async ({ params, request }) => {
	const { data } = await request.json();
	const id = Number(params.user_form_id);
	const updateData = buildUpdateData(data);
	const updated = await service.updateWhere(eq(FormSettingsTable.user_form_id, id), updateData);
	return json({ updated });
};
