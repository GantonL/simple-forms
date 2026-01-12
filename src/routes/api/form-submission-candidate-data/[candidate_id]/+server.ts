import { Service as service } from '$lib/server/database/services/forms-submissions-candidate-data';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const id = Number(params.candidate_id);
	const item = await service.findById(id);
	return json(item);
};

export const DELETE: RequestHandler = async ({ params }) => {
	const id = Number(params.candidate_id);
	const item = await service.deleteById(id);
	return json(item);
};
