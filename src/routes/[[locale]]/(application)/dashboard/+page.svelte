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

	let remoteBrowserServiceLoadStatusRes: Promise<
		RemoteBrwoserServiceLoadStatusResponse | undefined
	> = $state(page.data.remoteBrowserServiceLoadStatus);
	let remoteBrowserServiceLoadStatus: RemoteBrwoserServiceLoadStatusResponse | undefined =
		$state(undefined);

	let totalActiveFormsRes: Promise<number | undefined> = $state(page.data.totalActiveForms);
	let totalActiveForms: number = $state(0);
	let totalActiveFormLoaded = $state(false);
	onMount(() => {
		remoteBrowserServiceLoadStatusRes
			.then((res) => (remoteBrowserServiceLoadStatus = res));
		totalActiveFormsRes
		  .then((res) => totalActiveForms = res ?? 0)
		  .finally(() => totalActiveFormLoaded = true);
	});


</script>

<BasePage title="common.dashboard" description="seo.pages.dashboard.description">
    <div class="flex flex-col gap-4 items-center justify-center">
        {@render SlowServicesMessage(remoteBrowserServiceLoadStatus)}
    	<div class="w-full grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    	    {@render TotalActiveForms(totalActiveForms)}
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

{#snippet TotalActiveForms(totalActiveForms: number)}
    <Link link={{path: '/forms', label: ''}}>
    	<Card.Root>
    	    <Card.Header>
    			{#if totalActiveFormLoaded}
    			    <Card.Title class="text-5xl text-primary">{totalActiveForms}</Card.Title>
    			{:else}
    			    <LoaderCircle class="animate-spin text-primary" size={48}/>
    			{/if}
    			<Card.Description>{$t('common.active_forms')}</Card.Description>
    		</Card.Header>
    	</Card.Root>
    </Link>
{/snippet}
