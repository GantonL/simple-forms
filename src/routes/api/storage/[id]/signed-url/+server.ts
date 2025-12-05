import { getSignedUrl, type GetSignedUrlOptions } from '$lib/server/storage';
import { Service as FormsSubmissionsService } from '$lib/server/database/services/form-submissions';
import { Service as UserFormsService } from '$lib/server/database/services/user-form';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, params, url }) => {
	const userId = locals.user.id;
	const formSubmission = await FormsSubmissionsService.findById(Number(params.id));
	if (!formSubmission) {
		error(404, 'Submission not found');
	}
	const userForm = await UserFormsService.findById(formSubmission.user_form_id);
	if (!userForm) {
		error(500, 'Submission detached from a form');
	}
	if (userId !== userForm.user_id) {
		error(401, 'Unauthorized');
	}
	const path = formSubmission?.storage_url;
	if (!path) {
		error(500, 'Submission has no valid storage path');
	}
	const expirySecondsParamValue = url.searchParams.get('expirySeconds');
	const options: GetSignedUrlOptions = {};
	if (expirySecondsParamValue) {
		options.expirySeconds = Number(expirySecondsParamValue);
	}
	const signedUrl = await getSignedUrl(path, options);
	return json(signedUrl);
};
