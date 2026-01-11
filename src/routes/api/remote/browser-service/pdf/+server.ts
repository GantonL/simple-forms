import { json, type RequestHandler } from '@sveltejs/kit';
import { requestPdfCreation } from '$lib/server/remote/services/remote-browser';
export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	if (!body) return json({ success: false });
	const requested = await requestPdfCreation({
		formPublicLinkIndentifier: body.data.formPublicLinkIndentifier,
		formId: body.data.formId,
		formName: body.data.formName,
		submissionCandidateDataId: body.data.submissionCandidateDataId
	});
	return json({ success: !!requested });
};
