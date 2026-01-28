export enum WEBHOOKS {
	FORM_EVENTS = 'form-events'
}

export enum NOTIFICATIONS {
	FORM_SIGNED = 'form_signed',
	SIGNEE_REQUESTED_SIGNED_COPY = 'signee_requested_signed_copy'
}

interface EmailData {
	to: string[];
	subject: string;
	html: string;
}

export interface WebhookBody<D = EmailData> {
	event_type: NOTIFICATIONS;
	data: D;
}
