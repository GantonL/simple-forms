import type { FormSubmission } from '../database/schemas/form';
import { Service as UsersService } from '$lib/server/database/services/users';
import { Service as UsersFormsService } from '$lib/server/database/services/user-form';
import { NOTIFICATIONS, WEBHOOKS, type WebhookBody } from '$lib/models/workflows';
import formSignedSuccess from '$lib/templates/emails/form-signed-success';
import { BASE_APP_URL, WEBHOOK_BASE_URL } from '$env/static/private';
import { SearchParams } from '$lib/enums/search-params';
import { getFullFormattedDate } from '$lib/utils';

export async function sendFormSignedSuccessNotification(submission: FormSubmission) {
	const form = await UsersFormsService.findById(submission.user_form_id);
	if (!form) {
		console.error(
			'[sendFormSignedSuccessNotification]',
			'Failed to get the form from submission data:',
			`form id: ${submission.user_form_id}`
		);
	}

	const formOwner = await UsersService.findById(form!.user_id);
	if (!formOwner) {
		console.error(
			'[sendFormSignedSuccessNotification]',
			'Failed to get the form owner:',
			`user id: ${form!.user_id}`
		);
	}

	// const formSettings = await FormSettingsService.findById(form!.id);
	// if (!formsSettings.notifications[NOTIFICATIONS.FORM_SIGNED].enabled) {
	//   return;
	// }

	const email = formSignedSuccess({
		formName: form!.name,
		signee: submission.display_data!.signee as string,
		signedAt: getFullFormattedDate(submission.createdAt),
		subscriber: formOwner!.name,
		manageSettingsLink: `${BASE_APP_URL}/forms/${form!.id}/settings`,
		signedFormUrl: `${BASE_APP_URL}/forms/${form!.id}?${SearchParams.SubmissionId}=${submission.id}`
	});
	const body: WebhookBody = {
		event_type: NOTIFICATIONS.FORM_SIGNED,
		data: {
			to: [formOwner!.email],
			subject: email.subject,
			html: email.body
		}
	};
	console.log('[Workflow]', 'sending', NOTIFICATIONS.FORM_SIGNED, 'event');
	fetch(`${WEBHOOK_BASE_URL}/${WEBHOOKS.FORM_EVENTS}`, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then((res) => {
			if (!res?.ok) {
				console.error(
					'[Workflow] Failed to send webhook to workflow-manager',
					'status:',
					res.status,
					'statusText:',
					res.statusText
				);
			} else {
				console.log('[Workflow]', NOTIFICATIONS.FORM_SIGNED, 'event sent');
			}
		})
		.catch((error) => {
			console.error('[Workflow] Failed to send webhook to workflow-manager', 'error:', error);
		});
}
