<script lang="ts">
	import { locale, t } from '$lib/i18n';
	import type { UserForm } from '$lib/server/database/schemas/form';
	import { Copy, Link, LoaderCircle, X, Check, PowerOff, Share2, QrCode } from '@lucide/svelte';
	import * as Card from '../ui/card';
	import Button from '../ui/button/button.svelte';
	import { copyToClipboard } from '$lib/client/utils';
	import { toast } from 'svelte-sonner';
	import { AppCustomEventType } from '$lib/enums/app-custom-event-type';
	import { type AppCustomEvent } from '$lib/models/common';
	import Menu from '../menu/menu.svelte';
	import { menuConfiguration } from './configurations/menu';
	import { GET } from '$lib/api/helpers/request';
	import { UsersForms } from '../../../routes/api';
	import * as Dialog from '../ui/dialog';
	import * as Tooltip from '../ui/tooltip';
	import type { ClassValue } from 'svelte/elements';
	import BarChart from '../app-chart/bar-chart.svelte';
	import { chartConfiguration, chartProps } from './configurations/chart';
	import { Label } from '../ui/label';
	import type { BarChartData } from '$lib/models/chart';
	import EmptyResults from '../empty-results/empty-results.svelte';
	import { useSidebar } from '../ui/sidebar';
	import type { BarChartProps } from 'layerchart';
	import { getDirection } from '$lib/api/configurations/common';
	import type { AvailableLocals } from '$lib/enums/available-locales';
	import SvgQR from '@svelte-put/qr/svg/QR.svelte';

	let {
		data,
		onEvent,
		class: className,
		submissionsHistory
	}: {
		data: UserForm;
		onEvent: (event: AppCustomEvent<UserForm>) => void;
		class?: ClassValue;
		submissionsHistory: BarChartData[] | undefined;
	} = $props();
	let copyDialogOpenInProgress = $state(false);
	let copyLink = $state('');
	let copiedSuccess = $state(false);
	let copiedError = $state(false);
	let openCopyLinkDialog = $state(false);
	let dynamicChartConfiguration = $state(structuredClone(chartConfiguration));

	const sidebar = useSidebar();
	const submissionsHistoryChartProps = $state<BarChartProps<BarChartData[]>['props']>(chartProps);
	$effect(() => {
	  applySubmissionsChartProps();
	});

	function applySubmissionsChartProps() {
	    if (sidebar.isMobile) {
			submissionsHistoryChartProps!.xAxis = {
			    tickLabelProps: {
					rotate: 315,
					textAnchor: getDirection(locale.get() as AvailableLocals) === 'rl' ? 'start' : 'end'
				}
			}
		}
		else {
		  submissionsHistoryChartProps!.xAxis = {};
		}
	}

	locale.subscribe(() => {
		Object.keys(chartConfiguration).forEach((key) => {
			const label = chartConfiguration[key].label;
			if (label) {
				dynamicChartConfiguration[key].label = t.get(label);
			}
		});
	});

	async function onCopy(event: Event) {
		event.stopImmediatePropagation();
		copyDialogOpenInProgress = true;
		if (!data.public_link_identifier) return;
		copyLink = await GET<string>(`${UsersForms}/${data.id}/public-link`);
		openCopyLinkDialog = true;
		copyDialogOpenInProgress = false;
	}

	function executeCopy() {
		copyToClipboard(copyLink)
			.then(() => {
				toast.success(t.get('common.link_copied_to_clipboard'));
				copiedSuccess = true;
			})
			.catch(() => {
				toast.error(t.get('common.operation_failed'));
				copiedError = true;
			});
	}

	function onOpen() {
		onEvent?.({ type: AppCustomEventType.Open, data });
	}

	function onDialogOpenComplete() {
		copiedError = false;
		copiedSuccess = false;
	}

</script>

<button class="hover:cursor-pointer" onclick={onOpen}>
	<Card.Root
		class="{className} relative flex flex-col justify-between overflow-hidden {data.is_active ===
		false
			? 'opacity-60'
			: ''}"
	>
		{#if data.is_active === false}
			<div class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
				<PowerOff size={100} />
			</div>
		{/if}
		<Card.Header class="flex w-full flex-col">
			<Card.Title class="flex w-full flex-row items-center justify-between gap-2">
				<div class="flex min-w-0 grow">
					<span class="truncate">{data.name}</span>
				</div>
				<Menu
					configuration={menuConfiguration}
					rawData={data}
					event={(e) => onEvent({ type: e.type as AppCustomEventType, data })}
				/>
			</Card.Title>
			<Card.Description class="flex w-full">
				<span class="max-w-lg truncate">{data.description}</span>
			</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if data.is_active !== false}
				<BarChart data={submissionsHistory} configuration={dynamicChartConfiguration} props={submissionsHistoryChartProps}>
					{#snippet header()}
						<div class="flex flex-row gap-2 p-4 text-xl">
							<Label>{$t('common.submissions')}</Label>
							|
							<span>{data.submissions}</span>
						</div>
					{/snippet}
					{#snippet emptyState()}
					    <EmptyResults configuration={{class:'w-full'}}/>
					{/snippet}
				</BarChart>
			{/if}
		</Card.Content>
		<Card.Footer class="align-items flex flex-row justify-between gap-2">
			{@render copyLinkButton()}
			<span class="text-muted-foreground text-xs italic"
				>{$t('common.last_updated', {
					date: Intl.DateTimeFormat(locale.get()).format(new Date(data.updatedAt))
				})}</span
			>
		</Card.Footer>
	</Card.Root>
</button>

<Dialog.Root bind:open={openCopyLinkDialog} onOpenChangeComplete={onDialogOpenComplete}>
	<Dialog.Content>
		<Dialog.Title><h2 class="p-2">{$t('common.share')}</h2></Dialog.Title>
		<Card.Root class="min-w-0">
    		<Card.Header>
    		    <Card.Title class="flex flex-row gap-2 items-center">
        	        <Link size={12} class="text-secondary"></Link>
                    <span>{$t('common.copy_link')}</span>
    			</Card.Title>
    			<Card.Description>{$t('common.copy_link_description')}</Card.Description>
    		</Card.Header>
			<Card.Content>
        		<div class="flex flex-row items-center gap-2 rounded-md border p-2 shadow-md min-w-0 max-w-full" dir="ltr">
        			<p class="grow min-w-0 text-ellipsis overflow-hidden whitespace-nowrap">{copyLink}</p>
        			<Button variant="ghost" size="icon" onclick={executeCopy}>
        				{#if copiedError}
        					<X size={14} class="text-destructive" />
        				{:else if copiedSuccess}
        					<Check size={14} class="text-primary" />
        				{:else}
        					<Copy size={14} />
        				{/if}
        			</Button>
        		</div>
			</Card.Content>
		</Card.Root>
		<Card.Root class="min-w-0">
    		<Card.Header>
    		    <Card.Title class="flex flex-row gap-2 items-center">
        	        <QrCode size={12} class="text-secondary"/>
                    <span>{$t('common.qr_code')}</span>
    			</Card.Title>
                <Card.Description>{$t('common.qr_code_description')}</Card.Description>
    		</Card.Header>
			<Card.Content>
			    <div class="flex items-center justify-center">
			        <SvgQR data={copyLink} class="h-48 w-48"/>
				</div>
			</Card.Content>
		</Card.Root>
	</Dialog.Content>
</Dialog.Root>

{#snippet copyLinkButton()}
	{@const disabledInProgress = copyDialogOpenInProgress}
	{@const disabledNotActive = data.is_active === false}
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Button
				class="flex flex-row items-center gap-2"
				onclick={onCopy}
				disabled={disabledInProgress || disabledNotActive}
			>
				{#if copyDialogOpenInProgress}
					<LoaderCircle size={12} class="animate-spin" />
				{:else}
					<Share2 size={12} />
				{/if}
				<span>{$t('common.share')}</span>
			</Button>
		</Tooltip.Trigger>
		{#if disabledNotActive}
			<Tooltip.Content>
				{$t('common.form_disabled_copy_link_tooltip')}
			</Tooltip.Content>
		{/if}
	</Tooltip.Root>
{/snippet}
