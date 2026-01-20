import { LoadStatus } from '$lib/types/remote-browser';

export const LOAD_STATUS_MAPPING = {
	[LoadStatus.MINIMUM]: {
		message: 'common.remote_browser_service.load_status.minimum' //"Service is operating at minimum capacity.",
	},
	[LoadStatus.LOW]: {
		message: 'common.remote_browser_service.load_status.low' //"Service is operating at low capacity.",
	},
	[LoadStatus.MEDIUM]: {
		message: 'common.remote_browser_service.load_status.medium' //"Service is operating at medium capacity.",
	},
	[LoadStatus.HIGH]: {
		message: 'common.remote_browser_service.load_status.high' //"Service is operating at high capacity.",
	},
	[LoadStatus.EXTREME]: {
		message: 'common.remote_browser_service.load_status.extreme' //"Service is at full capacity. Requests are being queued.",
	},
	[LoadStatus.ERROR]: {
		message: ''
	}
};
