<script lang="ts">
	import { page } from '$app/state';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import * as Card from '$lib/components/ui/card';
	import { t } from '$lib/i18n';
	import type { RemoteBrwoserServiceLoadStatusResponse } from '$lib/types/remote-browser';
	import { LoaderCircle } from '@lucide/svelte';
	import { onMount } from 'svelte';

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
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
	    {@render TotalActiveForms(totalActiveForms)}
	</div>
</BasePage>

{#snippet TotalActiveForms(totalActiveForms: number)}
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
{/snippet}
