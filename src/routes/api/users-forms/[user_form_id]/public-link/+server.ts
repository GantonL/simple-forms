import { BASE_APP_URL } from '$env/static/private';
import { Service as service } from '$lib/server/database/services/user-form';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const id = Number(params.user_form_id);
	const item = await service.findById(id);
	const link = `${BASE_APP_URL}/f/${item?.public_link_identifier}`;
	return json(link);
};
