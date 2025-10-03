import type { Link } from '$lib/models/link';
import {
	BookLock,
	Cookie,
	Handshake,
	PersonStanding,
	Settings,
	DatabaseZap,
	LogIn,
	Signature
} from '@lucide/svelte';

export interface GroupedRoutes {
	title: string;
	children: Link[];
	excludeFromMainMenu?: boolean;
}
export const AppRoutes: GroupedRoutes[] = [
	{
		title: 'common.application',
		children: [
			{
				label: 'common.settings',
				path: '/settings',
				icon: Settings
			}
		]
	},
	{
		title: 'common.site',
		excludeFromMainMenu: true,
		children: [
			{
				label: 'common.cookies_policy',
				path: '/policies/cookies',
				icon: Cookie
			},
			{
				label: 'common.manage_cookies',
				path: '/manage-cookies',
				icon: Cookie,
				authenticationRequired: false
			},
			{
				label: 'common.privacy_policy',
				path: '/policies/privacy',
				icon: BookLock
			},
			{
				label: 'common.terms_of_service',
				path: '/policies/terms',
				icon: Handshake
			},
			{
				label: 'common.accessibility_statement',
				path: '/accessibility-statement',
				icon: PersonStanding
			}
		]
	},
	{
		title: 'common.authentication',
		excludeFromMainMenu: true,
		children: [
			{
				label: 'common.signin',
				path: '/signin',
				icon: LogIn,
				authenticationRequired: false
			},
			{
				label: 'common.signup',
				path: '/signup',
				icon: Signature,
				authenticationRequired: false
			}
		]
	}
];
