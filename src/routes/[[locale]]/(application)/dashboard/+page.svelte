<script lang="ts">
	import { page } from '$app/state';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import type { RemoteBrwoserServiceLoadStatusResponse } from '$lib/types/remote-browser';
	import { onMount } from 'svelte';

	let remoteBrowserServiceLoadStatusRes: Promise<
		RemoteBrwoserServiceLoadStatusResponse | undefined
	> = $state(page.data.remoteBrowserServiceLoadStatus);
	let remoteBrowserServiceLoadStatus: RemoteBrwoserServiceLoadStatusResponse | undefined =
		$state(undefined);
	onMount(() => {
		remoteBrowserServiceLoadStatusRes
			.then((res) => (remoteBrowserServiceLoadStatus = res))
	});
</script>

<BasePage title="common.dashboard" description="seo.pages.dashboard.description">
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

	</div>
</BasePage>
