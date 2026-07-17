<script lang="ts">
	import { page } from '$app/state';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';
	import { t } from '$lib/i18n';
	import {type RemoteBrwoserServiceLoadStatusResponse, LoadStatus } from '$lib/types/remote-browser';
	import { LoaderCircle } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { statusConfig } from './configurations/remote-browser-service-load-status';
	import Link from '$lib/components/link/link.svelte';
	import type { UserForm } from '$lib/server/database/schemas/form';

	let remoteBrowserServiceLoadStatusRes: Promise<
		RemoteBrwoserServiceLoadStatusResponse | undefined
	> = $state(page.data.remoteBrowserServiceLoadStatus);
	let remoteBrowserServiceLoadStatus: RemoteBrwoserServiceLoadStatusResponse | undefined =
		$state(undefined);

	let totalActiveFormsRes: Promise<UserForm[] | undefined> = page.data.totalActiveForms;
	let totalActiveForms: number = $state(0);
	let totalActiveFormLoaded = $state(false);

	let totalSubmissions: number = $state(0);

	onMount(() => {
		remoteBrowserServiceLoadStatusRes
			.then((res) => (remoteBrowserServiceLoadStatus = res));
		totalActiveFormsRes
		  .then((res) => {
				totalActiveForms = res?.length ?? 0;
				totalSubmissions = res?.reduce((acc, next) => acc + next.submissions, 0) ?? 0;
			})
		  .finally(() => totalActiveFormLoaded = true);
	});

</script>

<BasePage title="common.dashboard" description="seo.pages.dashboard.description">
    <div class="flex flex-col gap-4 items-center justify-center">
        {@render SlowServicesMessage(remoteBrowserServiceLoadStatus)}
    	<div class="w-full grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    	    {@render TotalActiveForms()}
    	    {@render TotalSubmissions()}
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
          label: 'common.active_forms'
        })}
    </Link>
{/snippet}

{#snippet TotalSubmissions()}
   	{@render CounterCard({
      isLoading: totalActiveFormLoaded,
      count: totalSubmissions,
      label: 'common.submissions'
    })}
{/snippet}

{#snippet CounterCard(params: {isLoading: boolean, count: number, label: string})}
    <Card.Root>
   	    <Card.Header>
 			{#if params.isLoading}
 			    <Card.Title class="text-5xl text-primary">{params.count}</Card.Title>
 			{:else}
 			    <LoaderCircle class="animate-spin text-primary" size={48}/>
 			{/if}
 			<Card.Description>{$t(params.label)}</Card.Description>
  		</Card.Header>
   	</Card.Root>
{/snippet}
