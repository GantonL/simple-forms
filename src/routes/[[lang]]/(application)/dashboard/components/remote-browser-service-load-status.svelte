<script lang="ts">
	import { LOAD_STATUS_MAPPING } from '$lib/client/configurations/remote-browser-service';
	import * as Card from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';
	import { t } from '$lib/i18n';
	import { direction } from '$lib/stores';
	import {
		LoadStatus,
		type RemoteBrwoserServiceLoadStatusResponse
	} from '$lib/types/remote-browser';
	import {
		Activity,
		AlertCircle,
		AlertOctagon,
		AlertTriangle,
		CheckCircle,
		Flame
	} from '@lucide/svelte';

	let { data }: { data: RemoteBrwoserServiceLoadStatusResponse | undefined } = $props();

	const statusConfig = {
		[LoadStatus.MINIMUM]: {
			icon: CheckCircle,
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
			icon: AlertTriangle,
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
			icon: AlertOctagon,
			color: 'text-red-500',
			bg: 'bg-red-500/20',
			bar: 'bg-red-500'
		},
		[LoadStatus.ERROR]: {
			icon: AlertCircle,
			color: 'text-red-500',
			bg: 'bg-red-500/10',
			bar: 'bg-red-500'
		}
	};

	let currentConfig = $derived(statusConfig[data?.status ?? LoadStatus.ERROR]);
	let percentageValue = $derived(parseInt(data?.percentage ?? '0'));
</script>

<Card.Root>
	<Card.Header class="flex flex-row items-center">
		<currentConfig.icon size={24} class={currentConfig.color} />
		<Card.Title class="font-medium">{$t('common.service_load_status')}</Card.Title>
	</Card.Header>
	{#if data}
		<Card.Content>
			<p class="text-muted-foreground text-xs">
				{$t(`${LOAD_STATUS_MAPPING[data.status].message}`)}
			</p>
			<Progress
				value={percentageValue}
				max={100}
				class="mt-1 {$direction === 'lr' ? '' : 'rotate-180'} {currentConfig.bg}"
				indicatorColor={currentConfig.bar}
			/>
			{#if data?.queue > 0}
				<div class="mt-2 flex items-center gap-2 text-xs text-red-500">
					<AlertOctagon class="h-3 w-3" />
					<span
						>{$t('common.queued_requests', {
							number: data!.queue
						})}</span
					>
				</div>
			{/if}
		</Card.Content>
	{/if}
</Card.Root>
