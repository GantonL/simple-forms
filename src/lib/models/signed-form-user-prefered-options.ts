import type { NOTIFICATIONS } from './workflows';

export interface SignedFormUserPreferedOptions {
	notifications?: {
		[NOTIFICATIONS.SIGNEE_REQUESTED_SIGNED_COPY]?: {
			signee_form_copy_email: string;
		};
	};
}
