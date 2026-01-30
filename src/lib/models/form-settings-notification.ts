import type { NOTIFICATIONS } from './workflows';

interface NotificationSettings {
	enabled: boolean;
}
export type FormSettingsNofitication = {
	[NOTIFICATIONS.FORM_SIGNED]: NotificationSettings;
};
