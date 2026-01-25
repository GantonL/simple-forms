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
import { sendFormSignedSuccessNotification } from '$lib/server/notifications/service';

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

	const uploadUrlObject = await getUploadUrlObject(Number(params.id), file.size, internalFetch);
	if (!uploadUrlObject?.uploadUrl || !uploadUrlObject?.path) {
		return new Response('Failed to get upload URL', { status: 400 });
	}

	const uploadResponse = await uploadFile(uploadUrlObject.uploadUrl, file);
	if (!uploadResponse?.ok) {
		return new Response('Upload failed', { status: 500 });
	}

	const submissionCandidateData = await getSubmissionCandidateData(form, internalFetch);

	const submitted = await createSubmission(
		Number(params.id),
		uploadUrlObject.path,
		submissionCandidateData.data,
		internalFetch
	);

	const result = submitted?.created?.length > 0 && submitted.created[0];
	if (!result) {
		return new Response('failed');
	}

	sendFormSignedSuccessNotification(result);

	deleteCandidateData(submissionCandidateData, internalFetch);

	increaseFormSubmissionsCount(params.id!, internalFetch);

	return new Response('success');
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

async function getUploadUrlObject(
	userFormId: number,
	fileSize: number,
	fetchFunction: typeof fetch
) {
	const uploadUrlResponse = await InternalPostRequest<
		{ user_form_id: number; fileSize: number },
		{ uploadUrl: string; path: string }
	>(
		UploadUrl,
		{
			user_form_id: userFormId,
			fileSize
		},
		{ fetch: fetchFunction }
	);

	return uploadUrlResponse;
}

async function uploadFile(uploadUrl: string, file: File) {
	const buffer = await file.arrayBuffer();
	const uploadResponse = await fetch(uploadUrl, {
		method: 'PUT',
		mode: 'cors',
		credentials: 'omit',
		body: buffer,
		headers: {
			'Content-Type': file.type,
			'Content-Length': buffer.byteLength.toString()
		}
	});
	return uploadResponse;
}

async function getSubmissionCandidateData(form: FormData, fetchFunction: typeof fetch) {
	const submissionCandidateDataId = form.get('submissionCandidateDataId');
	const submissionCandidateData = await InternalGetRequest<FormSubmissionCandidateDataSelect>(
		`${FormSubmissionCandidateData}/${submissionCandidateDataId}`,
		{ fetch: fetchFunction }
	);
	return submissionCandidateData;
}

async function createSubmission(
	userFormId: number,
	storagePath: string,
	displayData: FormSubmissionCandidateDataSelect['data'],
	fetchFunction: typeof fetch
) {
	const submitted = await InternalPostRequest<
		Pick<FormSubmission, 'storage_url' | 'user_form_id' | 'display_data'>,
		{ created: FormSubmission[] }
	>(
		FormsSubmissions,
		{
			user_form_id: userFormId,
			storage_url: storagePath,
			display_data: getDefaultDisplayData(displayData)
		},
		{ fetch: fetchFunction }
	);
	return submitted;
}

async function deleteCandidateData(
	submissionCandidateData: FormSubmissionCandidateDataSelect,
	fetchFunction: typeof fetch
) {
	if (!submissionCandidateData?.id) {
		console.error('No submission candidate data id found');
		return;
	}
	const deleteDataCandidateRes = await InternalDeleteRequest<
		unknown,
		FormSubmissionCandidateDataSelect
	>(`${FormSubmissionCandidateData}/${submissionCandidateData.id}`, {}, { fetch: fetchFunction });
	if (!deleteDataCandidateRes) {
		console.error('Submission candidate data was not deleted');
	}
}

async function increaseFormSubmissionsCount(userFormId: string, fetchFunction: typeof fetch) {
	InternalPutRequest<Pick<UserForm, 'submissions'>, unknown, { updated: UserForm }>(
		`${UsersForms}/${userFormId}`,
		{
			submissions: 1
		},
		{},
		{ fetch: fetchFunction }
	);
}
