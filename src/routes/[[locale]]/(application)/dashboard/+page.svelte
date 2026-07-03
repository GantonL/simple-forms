<script lang="ts">
	import { page } from '$app/state';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import type { RemoteBrwoserServiceLoadStatusResponse } from '$lib/types/remote-browser';
	import { onMount } from 'svelte';
	import RemoteBrowserServiceLoadStatus from './components/remote-browser-service-load-status.svelte';
	import { LoaderCircle } from '@lucide/svelte';

	let remoteBrowserServiceLoadStatusRes: Promise<
		RemoteBrwoserServiceLoadStatusResponse | undefined
	> = $state(page.data.remoteBrowserServiceLoadStatus);
	let initialLoading = $state(true);
	let remoteBrowserServiceLoadStatus: RemoteBrwoserServiceLoadStatusResponse | undefined =
		$state(undefined);
	onMount(() => {
		remoteBrowserServiceLoadStatusRes
			.then((res) => (remoteBrowserServiceLoadStatus = res))
			.finally(() => (initialLoading = false));
	});
</script>

<BasePage title="common.dashboard" description="seo.pages.dashboard.description">
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		{#if initialLoading}
			<div class="flex min-h-24 items-center justify-center">
				<LoaderCircle size={24} class="text-primary animate-spin "></LoaderCircle>
			</div>
		{:else}
			<RemoteBrowserServiceLoadStatus data={remoteBrowserServiceLoadStatus} />
		{/if}
	</div>
</BasePage>
