import type { NOTIFICATIONS } from './workflows';

interface NotificationSettings {
	enabled: boolean;
}
export type FormSettingsNofitication = Record<NOTIFICATIONS, NotificationSettings>;
