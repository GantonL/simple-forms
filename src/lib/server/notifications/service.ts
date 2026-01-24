import type { FormSubmission } from '../database/schemas/form';
import { Service as UsersService } from '$lib/server/database/services/users';
import { Service as UsersFormsService } from '$lib/server/database/services/user-form';
import { NOTIFICATIONS, WEBHOOKS, type WebhookBody } from '$lib/models/workflows';
import formSignedSuccess from '$lib/templates/emails/form-signed-success';
import { locale } from '$lib/i18n';
import { WEBHOOK_BASE_URL } from '$env/static/private';

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

	const email = formSignedSuccess({
		formName: form!.name,
		signee: submission.display_data!.signee as string,
		signedAt: Intl.DateTimeFormat(locale.get()).format(new Date(submission.createdAt)),
		subscriber: formOwner!.name
	});
	const body: WebhookBody = {
		event_type: NOTIFICATIONS.FORM_SIGNED,
		data: {
			to: [formOwner!.email],
			subject: email.subject,
			html: email.body
		}
	};
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
			}
		})
		.catch((error) => {
			console.error('[Workflow] Failed to send webhook to workflow-manager', 'error:', error);
		});
}
