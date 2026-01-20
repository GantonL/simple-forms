<script lang="ts">
	import { page } from '$app/state';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import type { RemoteBrwoserServiceLoadStatusResponse } from '$lib/types/remote-browser';
	import { LoadStatus } from '$lib/types/remote-browser';
	import * as Card from '$lib/components/ui/card';
	import Activity from '@lucide/svelte/icons/activity';
	import CheckCircle from '@lucide/svelte/icons/check-circle';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import AlertOctagon from '@lucide/svelte/icons/alert-octagon';
	import Flame from '@lucide/svelte/icons/flame';
	import { t } from '$lib/i18n';
	import { LOAD_STATUS_MAPPING } from '$lib/client/configurations/remote-browser-service';
	import { Progress } from '$lib/components/ui/progress';
	import { direction } from '$lib/stores';
	import { AlertCircle } from '@lucide/svelte';

	let remoteBrowserServiceLoadStatus: RemoteBrwoserServiceLoadStatusResponse | undefined = $state(
		page.data.remoteBrowserServiceLoadStatus
	);

	const statusConfig = {
		[LoadStatus.MINIMUM]: {
			icon: CheckCircle,
			color: 'text-green-500',
			bg: 'bg-green-500/10',
			bar: 'bg-green-500'
		},
		[LoadStatus.LOW]: {
			icon: Activity,
			color: 'text-blue-500',
			bg: 'bg-blue-500/10',
			bar: 'bg-blue-500'
		},
		[LoadStatus.MEDIUM]: {
			icon: AlertTriangle,
			color: 'text-yellow-500',
			bg: 'bg-yellow-500/10',
			bar: 'bg-yellow-500'
		},
		[LoadStatus.HIGH]: {
			icon: Flame,
			color: 'text-orange-500',
			bg: 'bg-orange-500/10',
			bar: 'bg-orange-500'
		},
		[LoadStatus.EXTREME]: {
			icon: AlertOctagon,
			color: 'text-red-500',
			bg: 'bg-red-500/10',
			bar: 'bg-red-500'
		},
		[LoadStatus.ERROR]: {
			icon: AlertCircle,
			color: 'text-red-500',
			bg: 'bg-red-500/10',
			bar: 'bg-red-500'
		}
	};

	let currentConfig = $derived(
		statusConfig[remoteBrowserServiceLoadStatus?.status ?? LoadStatus.ERROR]
	);
	let percentageValue = $derived(parseInt(remoteBrowserServiceLoadStatus?.percentage ?? '0'));
</script>

<BasePage title="common.dashboard" description="seo.pages.dashboard.description">
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<Card.Root>
			<Card.Header class="flex flex-row items-center">
				<currentConfig.icon size={24} class={currentConfig.color} />
				<Card.Title class="font-medium">{$t('common.service_load_status')}</Card.Title>
			</Card.Header>
			{#if remoteBrowserServiceLoadStatus}
				<Card.Content>
					<div class="text-2xl font-bold">{remoteBrowserServiceLoadStatus.percentage}</div>
					<p class="text-muted-foreground text-xs">
						{$t(`${LOAD_STATUS_MAPPING[remoteBrowserServiceLoadStatus.status].message}`)}
					</p>
					<Progress
						value={percentageValue}
						max={100}
						class="mt-1 {$direction === 'lr' ? '' : 'rotate-180'}"
					/>
					{#if remoteBrowserServiceLoadStatus?.queue > 0}
						<div class="mt-2 flex items-center gap-2 text-xs text-red-500">
							<AlertOctagon class="h-3 w-3" />
							<span
								>{$t('common.queued_requests', {
									number: remoteBrowserServiceLoadStatus!.queue
								})}</span
							>
						</div>
					{/if}
				</Card.Content>
			{/if}
		</Card.Root>
	</div>
</BasePage>
