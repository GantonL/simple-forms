import { Service as service } from '$lib/server/database/services/form-templates';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const id = String(params.template_id);
	const item = await service.findById(id);
	return json(item);
};
