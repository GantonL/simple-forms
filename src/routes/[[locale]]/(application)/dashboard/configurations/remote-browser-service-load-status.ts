import { LoadStatus } from '$lib/types/remote-browser';
import {
	Activity,
	CircleAlert,
	CircleCheckBig,
	Flame,
	OctagonAlert,
	TriangleAlert
} from '@lucide/svelte';

export const statusConfig = {
	[LoadStatus.MINIMUM]: {
		icon: CircleCheckBig,
		color: 'text-green-500',
		bg: 'bg-green-500/20'
	},
	[LoadStatus.LOW]: {
		icon: Activity,
		color: 'text-blue-500',
		bg: 'bg-blue-500/20'
	},
	[LoadStatus.MEDIUM]: {
		icon: TriangleAlert,
		color: 'text-yellow-500',
		bg: 'bg-yellow-500/20'
	},
	[LoadStatus.HIGH]: {
		icon: Flame,
		color: 'text-orange-500',
		bg: 'bg-orange-500/20'
	},
	[LoadStatus.EXTREME]: {
		icon: OctagonAlert,
		color: 'text-red-500',
		bg: 'bg-red-500/20'
	},
	[LoadStatus.ERROR]: {
		icon: CircleAlert,
		color: 'text-red-500',
		bg: 'bg-red-500/10'
	}
};
