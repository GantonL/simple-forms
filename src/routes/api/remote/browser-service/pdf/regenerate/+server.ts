import { json, type RequestHandler } from '@sveltejs/kit';
import { requestPdfCreation } from '$lib/server/remote/services/remote-browser';
import type { UserForm } from '$lib/server/database/schemas/form';
import { GET } from '$lib/api/helpers/request';
import { UsersForms } from '../../../..';
import { SearchParams } from '$lib/enums/search-params';
export const POST: RequestHandler = async ({ request, locals, fetch }) => {
	const body = await request.json();
	if (!body) return json({ success: false });
	const userId = locals.user.id;
	const userForm = await GET<UserForm>(
		`${UsersForms}/${body.data.formId}?${SearchParams.UserId}=${userId}`,
		{
			fetch
		}
	);
	if (!userForm.public_link_identifier) return json({ success: false });
	const requested = await requestPdfCreation({
		formPublicLinkIndentifier: userForm.public_link_identifier,
		formId: userForm.id,
		formName: userForm.name,
		submissionCandidateDataId: body.data.submissionCandidateDataId
	});
	return json({ success: !!requested });
};
