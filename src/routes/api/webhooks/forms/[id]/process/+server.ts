import type { RequestHandler } from '@sveltejs/kit';
import { FormsSubmissions, FormSubmissionCandidateData, UploadUrl, UsersForms } from '../../../..';
import {
	POST as InternalPostRequest,
	PUT as InternalPutRequest,
	DELETE as InternalDeleteRequest,
	GET as InternalGetRequest
} from '$lib/api/helpers/request';
import type {
	FormSubmission,
	FormSubmissionCandidateDataSelect,
	UserForm
} from '$lib/server/database/schemas/form';

export const POST: RequestHandler = async ({ request, params, fetch: internalFetch }) => {
	console.log('[Form webhook]', 'Requetsed to process a newly created form');
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

	const submissionCandidateDataId = form.get('submissionCandidateDataId');
	const submissionCandidateData = await InternalGetRequest<FormSubmissionCandidateDataSelect>(
		`${FormSubmissionCandidateData}/${submissionCandidateDataId}`,
		{ fetch: internalFetch }
	);

	const submitted = await InternalPostRequest<
		Pick<FormSubmission, 'storage_url' | 'user_form_id' | 'display_data'>,
		{ created: FormSubmission }
	>(
		FormsSubmissions,
		{
			user_form_id: Number(params.id),
			storage_url: uploadUrlResponse.path,
			display_data: getDefaultDisplayData(submissionCandidateData.data)
		},
		{ fetch: internalFetch }
	);

	const result = !!submitted?.created;
	if (result) {
		if (submissionCandidateDataId) {
			const deleteDataCandidateRes = await InternalDeleteRequest<
				unknown,
				FormSubmissionCandidateDataSelect
			>(
				`${FormSubmissionCandidateData}/${submissionCandidateDataId}`,
				{},
				{ fetch: internalFetch }
			);
			if (!deleteDataCandidateRes) {
				console.error('Submission candidate data was not deleted');
			}
		} else {
			console.error('No submission candidate data id found');
		}
	}

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

function getDefaultDisplayData(
	data: FormSubmissionCandidateDataSelect['data']
): FormSubmission['display_data'] {
	const fields = data!.fields!;
	const keys = Object.keys(fields);
	const signeeKey = keys.find((k) => k.includes('full_name') || k.includes('email'));
	return {
		signee: fields[signeeKey ?? keys[0]]
	};
}
