import type { RequestHandler } from '@sveltejs/kit';
import { FormsSubmissions, UploadUrl, UsersForms } from '../../../..';
import { POST as InternalPostRequest, PUT as InternalPutRequest } from '$lib/api/helpers/request';
import type { FormSubmission, UserForm } from '$lib/server/database/schemas/form';

export const POST: RequestHandler = async ({ request, params, fetch: internalFetch }) => {
	const form = await request.formData();

	const success = form.get('success');
	if (!success) {
		// TODO handle failed submisions
		const error = form.get('errorCode');
		const message = form.get('errorMessage');
		console.error('Failed response from remote browser service', error, message);
	}

	const file = form.get('file') as File;

	if (!file) {
		return new Response('No file provided', { status: 400 });
	}

	const uploadUrlResponse = await InternalPostRequest<
		{ user_form_id: number; fileSize: number },
		{ uploadUrl: string; path: string }
	>(
		UploadUrl,
		{
			user_form_id: Number(params.id),
			fileSize: file.size
		},
		{ fetch: internalFetch }
	);

	if (!uploadUrlResponse?.uploadUrl || !uploadUrlResponse?.path) {
		return new Response('Failed to get upload URL', { status: 400 });
	}

	const buffer = await file.arrayBuffer();
	const uploadResponse = await fetch(uploadUrlResponse.uploadUrl, {
		method: 'PUT',
		mode: 'cors',
		credentials: 'omit',
		body: buffer,
		headers: {
			'Content-Type': file.type,
			'Content-Length': buffer.byteLength.toString()
		}
	});

	if (!uploadResponse.ok) {
		return new Response('Upload failed', { status: 500 });
	}

	const submitted = await InternalPostRequest<
		{ user_form_id: number; storage_url: string },
		{ created: FormSubmission }
	>(
		FormsSubmissions,
		{
			user_form_id: Number(params.id),
			storage_url: uploadUrlResponse.path
		},
		{ fetch: internalFetch }
	);

	const result = !!submitted?.created;
	if (result) {
		InternalPutRequest<Pick<UserForm, 'submissions'>, unknown, { updated: UserForm }>(
			`${UsersForms}/${params.id}`,
			{
				submissions: 1
			},
			{},
			{ fetch: internalFetch }
		);
	}
	return new Response(result ? 'success' : 'failed');
};
