import { Service as service, buildUpdateData } from '$lib/server/database/services/user-form';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const id = String(params.user_form_id);
	const item = await service.findById(id);
	return json(item);
};

export const PUT: RequestHandler = async ({ params, request }) => {
	const { data } = await request.json();
	const id = String(params.user_form_id);
	const updateData = buildUpdateData(data);
	const updated = await service.updateById(id, updateData);
	return json({ updated });
};

export const DELETE: RequestHandler = async ({ params }) => {
	const id = String(params.user_form_id);
	const deleted = await service.deleteById(id);
	return json({ deleted });
};
