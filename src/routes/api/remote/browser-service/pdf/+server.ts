import { json, type RequestHandler } from '@sveltejs/kit';
import { requestPdfCreation } from '$lib/server/remote/services/remote-browser';
export const POST: RequestHandler = async ({ request }) => {
	const data = (await request.body?.getReader().read())?.value?.toString();
	if (!data) return json({ success: false });
	const body = JSON.parse(data);
	const requested = await requestPdfCreation({
		formPublicLinkIndentifier: body.data.formPublicLinkIndentifier,
		formId: body.data.formId,
		formName: body.data.formName
	});
	return json({ success: !!requested });
};
