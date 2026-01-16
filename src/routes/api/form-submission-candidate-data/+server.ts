import {
	buildCreateCandidates,
	getUrlFilters,
	getUrlOptions,
	Service as service
} from '$lib/server/database/services/forms-submissions-candidate-data';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { defaultCreateDateFilter } from './configurations';

export const GET: RequestHandler = async ({ url }) => {
	const filters = getUrlFilters(url);
	const options = getUrlOptions(url);
	filters.push(defaultCreateDateFilter);
	const items = await service.find(filters, options);
	return json(items);
};

export const POST: RequestHandler = async ({ request }) => {
	const { data: requestData } = await request.json();
	const { user_form_id, data } = requestData;

	if (!user_form_id || !data) {
		error(400, { message: 'missing_required_fields' });
	}

	const newSubmissionCandidateData = [{ user_form_id, data }];
	const itemsToCreate = buildCreateCandidates(newSubmissionCandidateData);
	const created = await service.createMany(itemsToCreate);
	return json({ created });
};
