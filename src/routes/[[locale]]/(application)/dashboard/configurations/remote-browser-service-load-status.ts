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
		bg: 'bg-green-500/20',
		bar: 'bg-green-500'
	},
	[LoadStatus.LOW]: {
		icon: Activity,
		color: 'text-blue-500',
		bg: 'bg-blue-500/20',
		bar: 'bg-blue-500'
	},
	[LoadStatus.MEDIUM]: {
		icon: TriangleAlert,
		color: 'text-yellow-500',
		bg: 'bg-yellow-500/20',
		bar: 'bg-yellow-500'
	},
	[LoadStatus.HIGH]: {
		icon: Flame,
		color: 'text-orange-500',
		bg: 'bg-orange-500/20',
		bar: 'bg-orange-500'
	},
	[LoadStatus.EXTREME]: {
		icon: OctagonAlert,
		color: 'text-red-500',
		bg: 'bg-red-500/20',
		bar: 'bg-red-500'
	},
	[LoadStatus.ERROR]: {
		icon: CircleAlert,
		color: 'text-red-500',
		bg: 'bg-red-500/10',
		bar: 'bg-red-500'
	}
};
