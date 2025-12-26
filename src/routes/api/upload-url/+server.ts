import { client } from '$lib/server/providers/supbase/client';
import { Service as UserFormsService } from '$lib/server/database/services/user-form';
import { error, json, type RequestHandler } from '@sveltejs/kit';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export const POST: RequestHandler = async ({ request }) => {
	const { data: requestData } = await request.json();
	const { user_form_id, fileSize } = requestData;
	if (!user_form_id || !fileSize) {
		error(400, { message: 'missing_required_fields' });
	}

	if (fileSize > MAX_FILE_SIZE) {
		error(400, { message: 'file_too_large' });
	}

	const userForm = await UserFormsService.findById(user_form_id);
	if (!userForm) {
		error(404, { message: 'form_not_found' });
	}

	const path = `${userForm.user_id}/${user_form_id}/${crypto.randomUUID()}`;

	const { data, error: uploadError } = await client.storage
		.from('forms')
		.createSignedUploadUrl(path);

	if (uploadError || !data) {
		error(500, { message: 'failed_to_generate_upload_url' });
	}

	return json({
		uploadUrl: data.signedUrl,
		path: data.path
	});
};
