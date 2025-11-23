import { FormSubmissionTable, UserFormTable } from '$lib/server/database/schemas/form';
import {
	Service as service,
	getUrlFilters,
	getUrlOptions,
	buildCreateCandidates,
	buildUpdateData,
	getBodyFilters
} from '$lib/server/database/services/form-submissions';
import { Service as UserFormsService } from '$lib/server/database/services/user-form';
import { uploadFile } from '$lib/server/storage';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url }) => {
	const filters = getUrlFilters(url);
	const options = getUrlOptions(url);
	options.select = {
		id: FormSubmissionTable.id,
		createdAt: FormSubmissionTable.createdAt,
		storageUrl: FormSubmissionTable.storage_url,
		userFormName: UserFormTable.name
	};
	options.innerJoin = {
		table: UserFormTable,
		condition: eq(FormSubmissionTable.user_form_id, UserFormTable.id)
	};
	const items = await service.find(filters, options);
	return json(items);
};

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.formData();
	const user_form_id = Number(data.get('user_form_id'));
	const file = data.get('file') as File;
	const userForm = await UserFormsService.findById(user_form_id);
	if (!userForm) {
		error(404, { message: 'item_not_found' });
	}
	const path = `${userForm.user_id}/${user_form_id}/${crypto.randomUUID()}`;
	const uploadRes = await uploadFile(file, path);
	if (!uploadRes || uploadRes.error !== null) {
		error(500, { message: 'upload_failed' });
	}
	const storage_url = uploadRes.data?.path ?? path;
	const newSubmissionData = [{ user_form_id, storage_url }];
	const itemsToCreate = buildCreateCandidates(newSubmissionData);
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
