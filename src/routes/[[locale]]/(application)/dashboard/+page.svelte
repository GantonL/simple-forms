<script lang="ts">
	import { page } from '$app/state';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';
	import { t } from '$lib/i18n';
	import {type RemoteBrwoserServiceLoadStatusResponse, LoadStatus } from '$lib/types/remote-browser';
	import {CircleCheck, Form, LoaderCircle, Signature, TriangleAlert } from '@lucide/svelte';
	import { onMount, type Component, type Snippet } from 'svelte';
	import { statusConfig } from './configurations/remote-browser-service-load-status';
	import Link from '$lib/components/link/link.svelte';
	import type { UserForm } from '$lib/server/database/schemas/form';
	import { GET } from '$lib/api/helpers/request';
	import { FormSubmissionCandidateData } from '../../../api';

	let remoteBrowserServiceLoadStatusRes: Promise<
		RemoteBrwoserServiceLoadStatusResponse | undefined
	> = $state(page.data.remoteBrowserServiceLoadStatus);
	let remoteBrowserServiceLoadStatus: RemoteBrwoserServiceLoadStatusResponse | undefined =
		$state(undefined);

	let totalActiveFormsRes: Promise<UserForm[] | undefined> = page.data.totalActiveForms;
	let totalActiveForms: number = $state(0);
	let totalActiveFormLoaded = $state(false);

	let totalSubmissions: number = $state(0);

	let totalSubmissionsAlerts: number = $state(0);
	let totalSubmissionsAlertsLoaded = $state(false);

	onMount(() => {
		remoteBrowserServiceLoadStatusRes
			.then((res) => (remoteBrowserServiceLoadStatus = res));
		totalActiveFormsRes
		    .then(onTotalActiveForms)
			.finally(() => totalActiveFormLoaded = true);
	});

	async function onTotalActiveForms(activeForms: UserForm[] | undefined) {
		totalActiveForms = activeForms?.length ?? 0;
		const activeFormsIds: number[] = [];
		activeForms?.forEach((form) => {
          activeFormsIds.push(form.id);
          totalSubmissions += form.submissions;
		});
		if (activeFormsIds?.length) {
		    totalSubmissionsAlerts = await GET<number>(`${FormSubmissionCandidateData}/count?fid=${activeFormsIds.join(',')}`);
			totalSubmissionsAlertsLoaded = true;
		}
	}

</script>

<BasePage title="common.dashboard" description="seo.pages.dashboard.description">
    <div class="flex flex-col gap-4 items-center justify-center">
        {@render SlowServicesMessage(remoteBrowserServiceLoadStatus)}
    	<div class="w-full grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    	    {@render TotalActiveForms()}
    	    {@render TotalSubmissions()}
    	    {@render SubmissionsAlerts()}
    	</div>
    </div>
</BasePage>

{#snippet SlowServicesMessage(status?: RemoteBrwoserServiceLoadStatusResponse)}
    {#if status && [LoadStatus.HIGH, LoadStatus.EXTREME].includes(status.status)}
        {@const config = statusConfig[status.status]}
    	<Alert.Root variant="destructive" class={`flex items-center justify-center ${config.bg}`}>
    	    <Alert.Title class={config.color}>{$t('common.slow_services_message')}</Alert.Title>
    	</Alert.Root>
	{/if}
{/snippet}

{#snippet TotalActiveForms()}
    <Link link={{path: '/forms', label: ''}}>
        {@render CounterCard({
          isLoading: totalActiveFormLoaded,
          count: totalActiveForms,
          label: 'common.active_forms',
          icon: Form,
          class: 'text-primary'
        })}
    </Link>
{/snippet}

{#snippet TotalSubmissions()}
   	{@render CounterCard({
      isLoading: totalActiveFormLoaded,
      count: totalSubmissions,
      label: 'common.submissions',
      icon: Signature,
      class: 'text-primary'
    })}
{/snippet}

{#snippet SubmissionsAlerts()}
   	{@render CounterCard({
      isLoading: totalSubmissionsAlertsLoaded,
      count: totalSubmissionsAlerts,
      label: 'common.alerts',
      icon: totalSubmissionsAlerts > 0 ? TriangleAlert : CircleCheck,
      class: totalSubmissionsAlerts > 0 ? 'text-destructive' : 'text-primary',
    })}
{/snippet}

{#snippet CounterCard(params: {isLoading: boolean, count: number, label: string, icon: Component, emptyState?: Snippet, class?: string})}
    <Card.Root class={params.class}>
        {#if params.count === 0 && params.emptyState}
            {@render params.emptyState()}
        {:else}
   	    <Card.Header class="flex flex-row flex-nowrap gap-4 justify-between">
            <div class="flex flex-col gap-2">
     			{#if params.isLoading}
     			    <Card.Title class="text-5xl text-inherit">{params.count}</Card.Title>
     			{:else}
     			    <LoaderCircle class="animate-spin text-inherit" size={48}/>
     			{/if}
     			<Card.Title>{$t(params.label)}</Card.Title>
            </div>
            <params.icon class="text-inherit" size={48}/>
  		</Card.Header>
        {/if}
   	</Card.Root>
{/snippet}
